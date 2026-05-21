export const userRole = {
  admin: "admin",
  user: "user",
  agent: "agent",
} as const;

export type Roles = "admin" | "user" | "agent";
