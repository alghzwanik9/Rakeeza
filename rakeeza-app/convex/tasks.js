import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return [];
    }
    return await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();
  },
});

export const add = mutation({
  args: {
    title: v.string(),
    type: v.string(),
    category: v.string(),
    duration: v.number(),
    completed: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    return await ctx.db.insert("tasks", {
      userId: identity.subject,
      ...args,
    });
  },
});

export const toggleComplete = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    if (task.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.patch(args.taskId, { completed: !task.completed });
    return task.completed; // return the previous completed state to help update points
  },
});

export const updateTask = mutation({
  args: { 
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    type: v.optional(v.string()),
    category: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const { taskId, ...updates } = args;
    const task = await ctx.db.get(taskId);
    if (!task) throw new Error("Task not found");
    if (task.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.patch(taskId, updates);
  },
});

export const remove = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");
    if (task.userId !== identity.subject) throw new Error("Unauthorized");

    await ctx.db.delete(args.taskId);
  },
});
