import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();
      
    if (!profile) {
      // Return a default profile if none exists
      return {
        name: identity.name || "",
        avatar: identity.pictureUrl || "",
        title: "",
        bio: "",
        skills: [],
        socialLinks: { linkedin: "", github: "", email: "" },
        projects: [],
        points: 0,
        streak: 0,
      };
    }
    return profile;
  },
});

export const initializeOrUpdateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    bio: v.optional(v.string()),
    avatar: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    socialLinks: v.optional(
      v.object({
        linkedin: v.optional(v.string()),
        github: v.optional(v.string()),
        email: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      return await ctx.db.insert("profiles", {
        userId: identity.subject,
        points: 0,
        streak: 0,
        projects: [],
        ...args,
      });
    }
  },
});

export const addProject = mutation({
  args: {
    id: v.string(),
    name: v.string(),
    description: v.string(),
    techStack: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not initialized");

    const projects = profile.projects || [];
    projects.push(args);

    await ctx.db.patch(profile._id, { projects });
  },
});

export const removeProject = mutation({
  args: { projectId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (!profile) throw new Error("Profile not initialized");

    const projects = (profile.projects || []).filter(p => p.id !== args.projectId);
    await ctx.db.patch(profile._id, { projects });
  },
});

export const updatePoints = mutation({
  args: { points: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { points: args.points });
    }
  },
});
