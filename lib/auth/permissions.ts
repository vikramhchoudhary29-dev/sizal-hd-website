export type AdminRole = "owner" | "super_admin" | "admin" | "editor";

export type Permission =
  | "dashboard.view"
  | "admins.view"
  | "admins.create"
  | "admins.update"
  | "admins.delete"
  | "products.manage"
  | "categories.manage"
  | "gallery.manage"
  | "downloads.manage"
  | "blogs.manage"
  | "dealers.view"
  | "settings.manage";

export const rolePermissions: Record<AdminRole, Permission[]> = {
  owner: [
    "dashboard.view",
    "admins.view",
    "admins.create",
    "admins.update",
    "admins.delete",
    "products.manage",
    "categories.manage",
    "gallery.manage",
    "downloads.manage",
    "blogs.manage",
    "dealers.view",
    "settings.manage",
  ],

  super_admin: [
    "dashboard.view",
    "products.manage",
    "categories.manage",
    "gallery.manage",
    "downloads.manage",
    "blogs.manage",
    "dealers.view",
    "settings.manage",
  ],

  admin: [
    "dashboard.view",
    "products.manage",
    "categories.manage",
    "gallery.manage",
    "downloads.manage",
    "blogs.manage",
    "dealers.view",
  ],

  editor: [
    "dashboard.view",
    "gallery.manage",
    "downloads.manage",
    "blogs.manage",
  ],
};

export function hasPermission(
  role: AdminRole,
  permission: Permission
) {
  return rolePermissions[role]?.includes(permission);
}