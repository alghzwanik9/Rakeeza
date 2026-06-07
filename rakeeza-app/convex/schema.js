import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    type: v.string(),
    category: v.string(),
    duration: v.number(),
    completed: v.boolean(),
  }).index("by_user", ["userId"]),

  events: defineTable({
    userId: v.string(),
    title: v.string(),
    date: v.string(),
    time: v.string(),
    type: v.string(),
  }).index("by_user", ["userId"]),

  profiles: defineTable({
    userId: v.string(),
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
    projects: v.optional(
      v.array(
        v.object({
          id: v.string(),
          name: v.string(),
          description: v.string(),
          techStack: v.string(),
        })
      )
    ),
    points: v.optional(v.number()),
    streak: v.optional(v.number()),
  }).index("by_user", ["userId"]),
});
