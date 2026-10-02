"use client";

import { auth } from "@/firebase/auth";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  MoreVertical,
  Pencil,
  Plus,
  RefreshCcw,
  Trash2,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { toast } from "sonner";

type Admin = {
  uid: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastSignInAt: string;
};

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editAdmin, setEditAdmin] = useState<Admin | null>(null);
  const [updating, setUpdating] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

async function loadAdmins(user = auth.currentUser) {
  setLoading(true);

  if (!user) {
    setAdmins([]);
    setLoading(false);
    return;
  }
 const token = await user.getIdToken(true);

  const res = await fetch("/api/admins/list", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    toast.error(data.error || "Failed to load admins");
    setLoading(false);
    return;
  }

  setAdmins(data.admins || []);
  setLoading(false);
}

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      loadAdmins(user);
    } else {
      setAdmins([]);
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []);

  async function createAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);

    const form = new FormData(e.currentTarget);
    const token = await auth.currentUser?.getIdToken();

    const res = await fetch("/api/admins/create", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
        role: form.get("role"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to create admin");
      setCreating(false);
      return;
    }

    toast.success("Admin created successfully");
    setOpenModal(false);
    setCreating(false);
    loadAdmins();
  }

  async function updateAdmin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editAdmin) return;

    setUpdating(true);

    const form = new FormData(e.currentTarget);
    const token = await auth.currentUser?.getIdToken();

    const res = await fetch("/api/admins/update", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        uid: editAdmin.uid,
        name: form.get("name"),
        role: form.get("role"),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to update admin");
      setUpdating(false);
      return;
    }

    toast.success("Admin updated successfully");
    setEditAdmin(null);
    setUpdating(false);
    loadAdmins();
  }

  async function toggleStatus(admin: Admin, disabled: boolean) {
    const token = await auth.currentUser?.getIdToken();

    const res = await fetch("/api/admins/status", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uid: admin.uid, disabled }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to update admin status");
      return;
    }

    toast.success(disabled ? "Admin disabled" : "Admin enabled");
    setMenuOpen(null);
    loadAdmins();
  }

  async function deleteAdmin() {
    if (!deleteTarget) return;

    const token = await auth.currentUser?.getIdToken();

    const res = await fetch("/api/admins/delete", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ uid: deleteTarget.uid }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to delete admin");
      return;
    }

    toast.success("Admin deleted successfully");
    setDeleteTarget(null);
    setMenuOpen(null);
    loadAdmins();
  }

  async function resetPassword(admin: Admin) {
    const token = await auth.currentUser?.getIdToken();

    const res = await fetch("/api/admins/reset-password", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ email: admin.email }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error || "Failed to generate reset password link");
      return;
    }

    await navigator.clipboard.writeText(data.resetLink);
    toast.success("Password reset link copied to clipboard");
    setMenuOpen(null);
  }

  const filteredAdmins = admins.filter((admin) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      admin.name?.toLowerCase().includes(searchText) ||
      admin.email?.toLowerCase().includes(searchText) ||
      admin.uid?.toLowerCase().includes(searchText);

    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" || admin.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-5">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-[#9a5a41]">
            Administration
          </p>

          <h1 className="mt-2 text-5xl font-black tracking-[-0.06em] text-[#2d2925]">
            Admin Management
          </h1>
        </div>

        <button
          onClick={() => setOpenModal(true)}
          className="rounded-2xl bg-gradient-to-r from-[#9a5a41] to-[#d8ad67] px-6 py-4 font-bold text-white shadow-xl"
        >
          <Plus className="mr-2 inline" size={18} />
          Add Admin
        </button>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-xl">
        <div className="grid gap-4 border-b border-[#ece6dc] bg-[#fbf8f3] p-5 md:grid-cols-[1fr_220px_220px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search admin by name, email or UID..."
            className="rounded-2xl border border-[#ddd2c5] bg-white px-5 py-4 outline-none focus:border-[#9a5a41]"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-2xl border border-[#ddd2c5] bg-white px-5 py-4 outline-none focus:border-[#9a5a41]"
          >
            <option value="all">All Roles</option>
            <option value="owner">Owner</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-[#ddd2c5] bg-white px-5 py-4 outline-none focus:border-[#9a5a41]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#f8f4ef]">
              <tr>
                <th className="p-5">Admin</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th className="pr-5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    Loading admins...
                  </td>
                </tr>
              ) : filteredAdmins.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    No admins found.
                  </td>
                </tr>
              ) : (
                filteredAdmins.map((admin) => (
                  <tr
                    key={admin.uid}
                    className="border-t border-[#eee6dc] transition hover:bg-[#fbf8f3]"
                  >
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#efe4d7] font-black text-[#8b5736]">
                          {admin.name
                            ? admin.name.charAt(0).toUpperCase()
                            : admin.email.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <p className="font-black">
                            {admin.name || "Unnamed"}
                          </p>
                          <p className="text-sm text-slate-500">
                            UID: {admin.uid.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="text-slate-600">{admin.email}</td>

                    <td>
                      <RoleBadge role={admin.role} />
                    </td>

                    <td>
                      <StatusBadge status={admin.status} />
                    </td>

                    <td className="text-sm text-slate-500">
                      {formatLogin(admin.lastSignInAt)}
                    </td>

                    <td className="relative pr-5">
                      <div className="flex justify-end">
                        <button
                          onClick={() =>
                            setMenuOpen(
                              menuOpen === admin.uid ? null : admin.uid
                            )
                          }
                          className="rounded-xl bg-[#f8f4ef] p-3 text-[#6f665e] transition hover:bg-[#efe4d7]"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {menuOpen === admin.uid && (
                          <div className="absolute right-5 top-14 z-20 w-56 overflow-hidden rounded-2xl border border-[#e8ddcf] bg-white shadow-2xl">
                            <MenuButton
                              icon={Pencil}
                              label="Edit"
                              onClick={() => {
                                setEditAdmin(admin);
                                setMenuOpen(null);
                              }}
                            />

                            <MenuButton
                              icon={admin.status === "active" ? UserX : UserCheck}
                              label={
                                admin.status === "active"
                                  ? "Disable"
                                  : "Enable"
                              }
                              onClick={() =>
                                toggleStatus(
                                  admin,
                                  admin.status === "active"
                                )
                              }
                            />

                            <MenuButton
                              icon={RefreshCcw}
                              label="Reset Password"
                              onClick={() => resetPassword(admin)}
                            />

                            <MenuButton
                              icon={Trash2}
                              label="Delete"
                              danger
                              onClick={() => {
                                setDeleteTarget(admin);
                                setMenuOpen(null);
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {openModal && (
        <AdminModal
          title="Create Admin"
          label="New Admin"
          onClose={() => setOpenModal(false)}
        >
          <form onSubmit={createAdmin} className="grid gap-5">
            <input
              name="name"
              required
              placeholder="Admin Name"
              className="rounded-2xl border p-4 outline-none focus:border-[#9a5a41]"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Email Address"
              className="rounded-2xl border p-4 outline-none focus:border-[#9a5a41]"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password minimum 6 characters"
              className="rounded-2xl border p-4 outline-none focus:border-[#9a5a41]"
            />

            <RoleSelect defaultValue="admin" />

            <button
              disabled={creating}
              className="rounded-2xl bg-gradient-to-r from-[#9a5a41] to-[#d8ad67] px-6 py-4 font-black text-white shadow-xl disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create Admin"}
            </button>
          </form>
        </AdminModal>
      )}

      {editAdmin && (
        <AdminModal
          title="Update Admin"
          label="Edit Admin"
          onClose={() => setEditAdmin(null)}
        >
          <form onSubmit={updateAdmin} className="grid gap-5">
            <input
              name="name"
              required
              defaultValue={editAdmin.name}
              placeholder="Admin Name"
              className="rounded-2xl border p-4 outline-none focus:border-[#9a5a41]"
            />

            <input
              value={editAdmin.email}
              readOnly
              className="rounded-2xl border bg-slate-100 p-4 text-slate-500 outline-none"
            />

            <RoleSelect defaultValue={editAdmin.role} />

            <button
              disabled={updating}
              className="rounded-2xl bg-gradient-to-r from-[#9a5a41] to-[#d8ad67] px-6 py-4 font-black text-white shadow-xl disabled:opacity-60"
            >
              {updating ? "Updating..." : "Update Admin"}
            </button>
          </form>
        </AdminModal>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-600">
              Delete Admin
            </p>

            <h2 className="mt-3 text-3xl font-black text-[#2d2925]">
              Are you sure?
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              This will permanently delete{" "}
              <span className="font-bold">{deleteTarget.email}</span>. This
              action cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-2xl border px-5 py-3 font-bold"
              >
                Cancel
              </button>

              <button
                onClick={deleteAdmin}
                className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white"
              >
                Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-bold transition ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-slate-700 hover:bg-[#fbf8f3]"
      }`}
    >
      <Icon size={17} />
      {label}
    </button>
  );
}

function AdminModal({
  title,
  label,
  onClose,
  children,
}: {
  title: string;
  label: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-8 shadow-2xl">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#9a5a41]">
              {label}
            </p>
            <h2 className="mt-2 text-3xl font-black">{title}</h2>
          </div>

          <button onClick={onClose} className="rounded-full bg-slate-100 p-3">
            <X size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function RoleSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <select
      name="role"
      defaultValue={defaultValue}
      className="rounded-2xl border p-4 outline-none focus:border-[#9a5a41]"
    >
      <option value="owner">Owner</option>
      <option value="super_admin">Super Admin</option>
      <option value="admin">Admin</option>
      <option value="editor">Editor</option>
    </select>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    owner: "bg-yellow-100 text-yellow-800",
    super_admin: "bg-purple-100 text-purple-700",
    admin: "bg-blue-100 text-blue-700",
    editor: "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${
        styles[role] || "bg-slate-100 text-slate-700"
      }`}
    >
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-bold ${
        status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatLogin(date?: string) {
  if (!date) return "Never logged in";

  const timestamp = new Date(date).getTime();

  if (Number.isNaN(timestamp)) return "Never logged in";

  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}