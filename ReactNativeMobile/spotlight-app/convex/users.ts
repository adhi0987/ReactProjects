import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a new user with the given details
export const createUser = mutation({
  args: {
    username: v.string(),
    fullname: v.string(),
    image: v.string(),
    bio: v.optional(v.string()),
    email: v.string(),
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("[createUser] Handler called with args:", args);

    try {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();

      if (existingUser) {
        console.log(`[createUser] User with clerkId "${args.clerkId}" already exists. Skipping creation.`);
        return;
      }

      const newUser = {
        username: args.username,
        fullname: args.fullname,
        email: args.email,
        bio: args.bio || "",
        clerkId: args.clerkId,
        image: args.image,
        followers: 0,
        following: 0,
        posts: 0,
      };

      const insertedId = await ctx.db.insert("users", newUser);
      console.log(`[createUser] New user created with ID: ${insertedId}`);
      return insertedId;

    } catch (error) {
      console.error("[createUser] Error creating user:", error);
      throw new Error("Failed to create user. See logs for more details.");
    }
  },
});
