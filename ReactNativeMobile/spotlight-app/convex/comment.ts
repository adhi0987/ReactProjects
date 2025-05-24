import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./users";

export const addComment = mutation({
  args: {
    content: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const currentUser = getAuthenticatedUser(ctx);
    const post = await ctx.db.get(args.postId);

    if (!post) throw new ConvexError("Post not found");

    const commentId = await ctx.db.insert("comments", {
      userId: (await currentUser)._id,
      postId: args.postId,
      content: args.content,
    });
    //increment comments count
    await ctx.db.patch(args.postId, { comments: post.comments + 1 });

    if (post.userId !== (await currentUser)._id) {
      await ctx.db.insert("notifications", {
        recieverId: post.userId,
        senderId: (await currentUser)._id,
        type: "comment",
        commentId,
      });
    }
    return commentId;
  },
});

export const getComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    const commentWithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            fullname: user!.fullname,
            image: user!.image,
          },
        };
      })
    );
    return commentWithInfo;
  },
});
