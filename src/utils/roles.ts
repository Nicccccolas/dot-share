import { Role } from "@prisma/client";

const allRoles = {
  [Role.USER]: [],
  [Role.ADMIN]: ["getUsers", "manageUsers"],
};

export const Roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
