import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticatedUser } from "./users";

// For handling the generation of images
export const generateUploader = mutation(async (ctx) => {
  try {
    console.log("[generateUploader] Attempting to get identity");
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorised");
    const url = await ctx.storage.generateUploadUrl();
    console.log("[generateUploader] Upload URL generated:", url);
    return url;
  } catch (error) {
    console.error("[generateUploader] Error:", error);
    throw new Error("Failed to generate upload URL");
  }
});

// For creating a post and updating post count
export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    try {
      console.log("[createPost] Creating post with args:", args);
      const currentUser = await getAuthenticatedUser(ctx);
      const imageUrl = await ctx.storage.getUrl(args.storageId);
      if (!imageUrl) throw new Error("Image not found");

      const postId = await ctx.db.insert("posts", {
        userId: currentUser._id,
        imageUrl,
        storageId: args.storageId,
        caption: args.caption,
        likes: 0,
        comments: 0,
      });
      console.log("[createPost] Post created with ID:", postId);

      await ctx.db.patch(currentUser._id, {
        posts: currentUser.posts + 1,
      });
      console.log("[createPost] Updated user's post count");

      return postId;
    } catch (error) {
      console.error("[createPost] Error:", error);
      throw new Error("Failed to create post");
    }
  },
});

// For getting the feed from others
export const getFeedPosts = query({
  handler: async (ctx) => {
    try {
      console.log("[getFeedPosts] Fetching posts for user");
      const currentUser = await getAuthenticatedUser(ctx);
      const posts = await ctx.db.query("posts").order("desc").collect();
      if (posts.length === 0) {
        console.log("[getFeedPosts] No posts found");
        return [];
      }

      const postsWithInfo = await Promise.all(
        posts.map(async (post) => {
          const postAuthor = await ctx.db.get(post.userId);
          const likes = await ctx.db
            .query("likes")
            .withIndex("by_user_and_post", (q) =>
              q.eq("userId", currentUser._id).eq("postId", post._id)
            )
            .first();
          const bookmarks = await ctx.db
            .query("bookmarks")
            .withIndex("by_both", (q) =>
              q.eq("postId", post._id).eq("userId", currentUser._id)
            )
            .first();

          return {
            ...post,
            author: {
              _id: postAuthor?._id,
              username: postAuthor?.username,
              image: postAuthor?.image,
            },
            isLiked: !!likes,
            isBookmarked: !!bookmarks,
          };
        })
      );

      console.log(`[getFeedPosts] Returning ${postsWithInfo.length} posts`);
      return postsWithInfo;
    } catch (error) {
      console.error("[getFeedPosts] Error:", error);
      throw new Error("Failed to load feed posts");
    }
  },
});

// For like/unlike post toggle
export const toggleLike = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    try {
      console.log("[toggleLike] Toggling like for post:", args.postId);
      const currentUser = await getAuthenticatedUser(ctx);
      const existing = await ctx.db
        .query("likes")
        .withIndex("by_user_and_post", (q) =>
          q.eq("userId", currentUser._id).eq("postId", args.postId)
        )
        .first();
      const post = await ctx.db.get(args.postId);
      if (!post) throw new Error("Post not found");

      if (existing) {
        await ctx.db.delete(existing._id);
        await ctx.db.patch(args.postId, { likes: post.likes - 1 });
        console.log("[toggleLike] Unliked the post");
        return false;
      } else {
        await ctx.db.insert("likes", {
          userId: currentUser._id,
          postId: args.postId,
        });
        await ctx.db.patch(args.postId, { likes: post.likes + 1 });
        console.log("[toggleLike] Liked the post");

        if (currentUser._id !== post.userId) {
          await ctx.db.insert("notifications", {
            recieverId: post.userId,
            senderId: currentUser._id,
            type: "like",
            postId: args.postId,
          });
          console.log("[toggleLike] Notification sent to post author");
        }

        return true;
      }
    } catch (error) {
      console.error("[toggleLike] Error:", error);
      throw new Error("Failed to toggle like");
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    // verify owner ship

    const post = await ctx.db.get(args.postId);
    if (post?.userId !== currentUser._id)
      throw new Error("Not Authorised to delete this post");
    //delete all likes  of the post
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }
    //delete all comments of the post
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }
    //delete all bookmakrs of the post
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_posts", (q) => q.eq("postId", args.postId))
      .collect();
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }
    // delete notifications related to post
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }
    //delete post
    await ctx.storage.delete(post.storageId);
    await ctx.db.delete(args.postId);

    //decrement users post
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(0, (currentUser.posts || 1) - 1),
    });
  },
});

export const getPostByUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const user = args.userId
      ? await ctx.db.get(args.userId)
      : await getAuthenticatedUser(ctx);

    if (!user) throw new Error("user not found");

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return posts;
  },
});
