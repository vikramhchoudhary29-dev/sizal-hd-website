"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  Check,
  ChevronDown,
  Edit3,
  Eye,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { Dealer, DealerStatus } from "@/types/dealer";
import { adminFetch } from "@/lib/api/adminToken";
import * as XLSX from "xlsx";

const emptyDealer: Omit<Dealer, "id" | "createdAt" | "updatedAt"> = {
  dealerName: "",
  shopName: "",
  ownerName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  gstNumber: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  dealerType: "",
  existingBrands: "",
  monthlyPurchase: "",
  interestedProducts: "",
  salesRepresentative: "",
  status: "new",
  notes: "",
};

const statusOptions: Array<{ value: DealerStatus; label: string }> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
];

function statusClasses(status: DealerStatus) {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "contacted":
      return "bg-blue-50 text-blue-700 ring-blue-200";
    case "rejected":
      return "bg-red-50 text-red-700 ring-red-200";
    default:
      return "bg-amber-50 text-amber-700 ring-amber-200";
  }
}

function formatDate(value?: string | Date) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function cleanPhone(value: string) {
  return value.replace(/[^0-9+]/g, "");
}

function whatsappUrl(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  const normalized = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

function DealerStatusBadge({ status }: { status: DealerStatus }) {
  const label = statusOptions.find((item) => item.value === status)?.label ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold capitalize ring-1 ${statusClasses(status)}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

export default function DealersPage() {
  const [items, setItems] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DealerStatus>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Dealer | null>(null);
  const [viewing, setViewing] = useState<Dealer | null>(null);

  async function load() {
    setLoading(true);
    try {
      const response = await adminFetch("/api/content/dealers", {
        cache: "no-store",
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to load dealers");
      setItems(Array.isArray(json.data) ? json.data : []);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to load dealers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((dealer) => {
      const matchesStatus = statusFilter === "all" || dealer.status === statusFilter;
      if (!matchesStatus) return false;
      if (!normalizedQuery) return true;

      return [
        dealer.dealerName,
        dealer.shopName,
        dealer.ownerName,
        dealer.mobile,
        dealer.whatsapp,
        dealer.email,
        dealer.city,
        dealer.state,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [items, query, statusFilter]);

  const stats = useMemo(
    () => ({
      total: items.length,
      active: items.filter((item) => item.status === "active").length,
      new: items.filter((item) => item.status === "new").length,
      contacted: items.filter((item) => item.status === "contacted").length,
    }),
    [items]
  );

  function exportExcel() {
    if (!items.length) {
      alert("There are no dealer records to export.");
      return;
    }

    const rows = items.map((dealer) => ({
      "Dealer Name": dealer.dealerName,
      "Shop Name": dealer.shopName,
      "Owner Name": dealer.ownerName,
      "Mobile": dealer.mobile,
      "WhatsApp": dealer.whatsapp,
      "Email": dealer.email,
      "GST Number": dealer.gstNumber,
      "Address": dealer.address,
      "City": dealer.city,
      "State": dealer.state,
      "Pincode": dealer.pincode,
      "Dealer Type": dealer.dealerType,
      "Existing Brands": dealer.existingBrands,
      "Monthly Purchase": dealer.monthlyPurchase,
      "Interested Products": dealer.interestedProducts,
      "Sales Representative": dealer.salesRepresentative,
      "Status": dealer.status,
      "Notes": dealer.notes,
      "Created At": dealer.createdAt ? new Date(dealer.createdAt).toLocaleString("en-IN") : "",
      "Updated At": dealer.updatedAt ? new Date(dealer.updatedAt).toLocaleString("en-IN") : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet["!cols"] = [
      { wch: 24 }, { wch: 24 }, { wch: 22 }, { wch: 16 }, { wch: 16 },
      { wch: 30 }, { wch: 20 }, { wch: 42 }, { wch: 18 }, { wch: 18 },
      { wch: 12 }, { wch: 18 }, { wch: 28 }, { wch: 20 }, { wch: 34 },
      { wch: 24 }, { wch: 14 }, { wch: 36 }, { wch: 22 }, { wch: 22 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dealers");
    XLSX.writeFile(workbook, `sizal-hd-dealers-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function openCreate() {
    setEditing(null);
    setShowForm(true);
  }

  function openEdit(dealer: Dealer) {
    setEditing(dealer);
    setShowForm(true);
    setViewing(null);
  }

  async function submitDealer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    try {
      const form = new FormData(event.currentTarget);
      const body = Object.fromEntries(form.entries());
      const id = editing?.id;

      const response = await adminFetch(
        id ? `/api/content/dealers/${id}` : "/api/content/dealers",
        {
          method: id ? "PATCH" : "POST",
          body: JSON.stringify(body),
        }
      );

      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Failed to save dealer");

      setShowForm(false);
      setEditing(null);
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save dealer");
    } finally {
      setSaving(false);
    }
  }

  async function deleteDealer(id: string) {
    if (!confirm("Delete this dealer permanently?")) return;

    const response = await adminFetch(`/api/content/dealers/${id}`, {
      method: "DELETE",
    });
    const json = await response.json();

    if (!response.ok) {
      alert(json.error || "Delete failed");
      return;
    }

    setViewing(null);
    await load();
  }

  async function updateStatus(dealer: Dealer, status: DealerStatus) {
    const response = await adminFetch(`/api/content/dealers/${dealer.id}`, {
      method: "PATCH",
      body: JSON.stringify({ ...dealer, status }),
    });
    const json = await response.json();

    if (!response.ok) {
      alert(json.error || "Failed to update status");
      return;
    }

    setViewing((current) => (current ? { ...current, status } : current));
    await load();
  }

  return (
    <div className="min-w-0">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-blue-700">
            <Users size={14} /> Dealer Management
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
            Dealers
          </h1>
          <p className="mt-2 max-w-2xl text-slate-500">
            Manage dealer enquiries, contact details and account status from one place.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={exportExcel}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 font-extrabold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50"
          >
            Export Excel
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 font-extrabold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            <Plus size={19} />
            Add Dealer
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Total Dealers" value={stats.total} />
        <StatCard icon={ShieldCheck} label="Active" value={stats.active} />
        <StatCard icon={Plus} label="New Enquiries" value={stats.new} />
        <StatCard icon={MessageCircle} label="Contacted" value={stats.contacted} />
      </div>

      <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search dealer, shop, owner, mobile or city..."
              className="min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <div className="relative lg:w-52">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | DealerStatus)
              }
              className="min-h-12 w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 pr-10 font-semibold outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>
      </div>

      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Dealer</th>
                <th className="px-4 py-4">Contact</th>
                <th className="px-4 py-4">Location</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-500">
                    Loading dealers...
                  </td>
                </tr>
              ) : filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center">
                    <Users className="mx-auto text-slate-300" size={38} />
                    <p className="mt-3 font-bold text-slate-700">No dealers found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try another search or add a new dealer.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/70"
                  >
                    <td className="px-6 py-5">
                      <button
                        type="button"
                        onClick={() => setViewing(dealer)}
                        className="text-left"
                      >
                        <p className="font-extrabold text-slate-950 hover:text-blue-700">
                          {dealer.dealerName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">{dealer.shopName}</p>
                        {dealer.ownerName && (
                          <p className="mt-1 text-xs text-slate-400">Owner: {dealer.ownerName}</p>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-5">
                      <p className="font-semibold text-slate-700">{dealer.mobile || "—"}</p>
                      {dealer.email && (
                        <p className="mt-1 max-w-[190px] truncate text-xs text-slate-400">
                          {dealer.email}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <p className="max-w-[180px] truncate font-semibold text-slate-700">
                        {dealer.city || dealer.state || "—"}
                      </p>
                      {dealer.dealerType && (
                        <p className="mt-1 text-xs text-slate-400">{dealer.dealerType}</p>
                      )}
                    </td>
                    <td className="px-4 py-5">
                      <DealerStatusBadge status={dealer.status} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton label="Call" href={`tel:${cleanPhone(dealer.mobile)}`} icon={Phone} />
                        {dealer.whatsapp || dealer.mobile ? (
                          <IconButton
                            label="WhatsApp"
                            href={whatsappUrl(dealer.whatsapp || dealer.mobile)}
                            icon={MessageCircle}
                            external
                          />
                        ) : null}
                        {dealer.email ? (
                          <IconButton
                            label="Email"
                            href={`mailto:${dealer.email}`}
                            icon={Mail}
                          />
                        ) : null}
                        <button
                          type="button"
                          title="View dealer"
                          onClick={() => setViewing(dealer)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          type="button"
                          title="Edit dealer"
                          onClick={() => openEdit(dealer)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                        >
                          <Edit3 size={17} />
                        </button>
                        <button
                          type="button"
                          title="Delete dealer"
                          onClick={() => deleteDealer(dealer.id)}
                          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:hidden">
        {loading ? (
          <div className="rounded-3xl border bg-white p-8 text-center text-slate-500">
            Loading dealers...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-3xl border bg-white p-8 text-center">
            <Users className="mx-auto text-slate-300" size={38} />
            <p className="mt-3 font-bold text-slate-700">No dealers found</p>
          </div>
        ) : (
          filteredItems.map((dealer) => (
            <div key={dealer.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <button type="button" onClick={() => setViewing(dealer)} className="min-w-0 text-left">
                  <p className="truncate text-lg font-black text-slate-950">{dealer.dealerName}</p>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-500">{dealer.shopName}</p>
                </button>
                <DealerStatusBadge status={dealer.status} />
              </div>

              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <Phone size={16} className="shrink-0 text-slate-400" />
                  <span>{dealer.mobile || "No mobile"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin size={16} className="shrink-0 text-slate-400" />
                  <span>{[dealer.city, dealer.state].filter(Boolean).join(", ") || "No location"}</span>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <a
                  href={`tel:${cleanPhone(dealer.mobile)}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-3 text-sm font-extrabold text-white"
                >
                  <Phone size={16} /> Call
                </a>
                <a
                  href={whatsappUrl(dealer.whatsapp || dealer.mobile) || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-extrabold text-slate-700"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setViewing(dealer)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-extrabold text-slate-700"
                >
                  <Eye size={16} /> View
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(dealer)}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-extrabold text-slate-700"
                >
                  <Edit3 size={16} /> Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <DealerFormModal
          dealer={editing}
          saving={saving}
          onClose={() => {
            if (!saving) {
              setShowForm(false);
              setEditing(null);
            }
          }}
          onSubmit={submitDealer}
        />
      )}

      {viewing && (
        <DealerDetailsModal
          dealer={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => openEdit(viewing)}
          onDelete={() => deleteDealer(viewing.id)}
          onStatusChange={(status) => updateStatus(viewing, status)}
        />
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function IconButton({
  href,
  label,
  icon: Icon,
  external = false,
}: {
  href: string;
  label: string;
  icon: typeof Phone;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      <Icon size={17} />
    </a>
  );
}

function DealerFormModal({
  dealer,
  saving,
  onClose,
  onSubmit,
}: {
  dealer: Dealer | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const value = (field: keyof typeof emptyDealer) => dealer?.[field] ?? emptyDealer[field];

  return (
    <ModalShell title={dealer ? "Edit Dealer" : "Add Dealer"} onClose={onClose} wide>
      <form onSubmit={onSubmit} className="space-y-6">
        <section>
          <div className="mb-4">
            <p className="text-base font-black text-slate-950">Basic details</p>
            <p className="mt-1 text-sm text-slate-500">Keep the core dealer information together.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Dealer / Contact Name" name="dealerName" defaultValue={value("dealerName")} required />
            <FormField label="Shop Name" name="shopName" defaultValue={value("shopName")} required />
            <FormField label="Mobile Number" name="mobile" defaultValue={value("mobile")} required type="tel" />
            <FormField label="WhatsApp Number" name="whatsapp" defaultValue={value("whatsapp")} type="tel" />
            <FormField label="Owner Name" name="ownerName" defaultValue={value("ownerName")} />
            <FormField label="Email" name="email" defaultValue={value("email")} type="email" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-base font-black text-slate-950">Location & status</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <FormField label="City" name="city" defaultValue={value("city")} />
            <FormField label="State" name="state" defaultValue={value("state")} />
            <FormField label="Pincode" name="pincode" defaultValue={value("pincode")} />
            <div>
              <label className="mb-2 block text-sm font-extrabold text-slate-700">Status</label>
              <select
                name="status"
                defaultValue={value("status")}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
            <FormField label="Dealer Type" name="dealerType" defaultValue={value("dealerType")} />
            <FormField label="GST Number" name="gstNumber" defaultValue={value("gstNumber")} />
          </div>
        </section>

        <details className="rounded-2xl border border-slate-200">
          <summary className="cursor-pointer list-none px-4 py-4 text-sm font-black text-slate-800">
            Business details <span className="font-semibold text-slate-400">(optional)</span>
          </summary>
          <div className="grid gap-4 border-t border-slate-100 p-4 md:grid-cols-2">
            <FormField label="Monthly Purchase" name="monthlyPurchase" defaultValue={value("monthlyPurchase")} />
            <FormField label="Existing Brands" name="existingBrands" defaultValue={value("existingBrands")} />
            <FormField label="Interested Products" name="interestedProducts" defaultValue={value("interestedProducts")} />
            <FormField label="Sales Representative" name="salesRepresentative" defaultValue={value("salesRepresentative")} />
          </div>
        </details>

        <details className="rounded-2xl border border-slate-200">
          <summary className="cursor-pointer list-none px-4 py-4 text-sm font-black text-slate-800">
            Address & internal notes <span className="font-semibold text-slate-400">(optional)</span>
          </summary>
          <div className="grid gap-4 border-t border-slate-100 p-4">
            <div>
              <label className="mb-2 block text-sm font-extrabold text-slate-700">Address</label>
              <textarea name="address" defaultValue={value("address")} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" placeholder="Full shop / business address" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-extrabold text-slate-700">Notes</label>
              <textarea name="notes" defaultValue={value("notes")} rows={3} className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50" placeholder="Internal notes" />
            </div>
          </div>
        </details>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} disabled={saving} className="min-h-12 rounded-xl border border-slate-200 px-5 font-extrabold text-slate-700">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-extrabold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60">
            <Check size={18} />
            {saving ? "Saving..." : dealer ? "Save Changes" : "Create Dealer"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function FormField({
  label,
  name,
  defaultValue,
  required = false,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-extrabold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="min-h-12 w-full rounded-xl border border-slate-200 px-4 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
      />
    </div>
  );
}

function DealerDetailsModal({
  dealer,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  dealer: Dealer;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (status: DealerStatus) => void;
}) {
  return (
    <ModalShell title="Dealer Details" onClose={onClose} wide>
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-2xl font-black text-slate-950">{dealer.dealerName}</p>
              <p className="mt-1 font-semibold text-slate-500">{dealer.shopName}</p>
              {dealer.ownerName && (
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <UserRound size={15} /> {dealer.ownerName}
                </p>
              )}
            </div>
            <DealerStatusBadge status={dealer.status} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a
              href={`tel:${cleanPhone(dealer.mobile)}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 font-extrabold text-white"
            >
              <Phone size={17} /> Call {dealer.mobile || "Dealer"}
            </a>
            <a
              href={whatsappUrl(dealer.whatsapp || dealer.mobile) || "#"}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 font-extrabold text-slate-700"
            >
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem icon={Phone} label="Mobile" value={dealer.mobile} />
          <DetailItem icon={MessageCircle} label="WhatsApp" value={dealer.whatsapp || "—"} />
          <DetailItem icon={Mail} label="Email" value={dealer.email || "—"} />
          <DetailItem icon={Building2} label="Dealer Type" value={dealer.dealerType || "—"} />
          <DetailItem icon={MapPin} label="City / State" value={[dealer.city, dealer.state].filter(Boolean).join(", ") || "—"} />
          <DetailItem icon={MapPin} label="Pincode" value={dealer.pincode || "—"} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoBlock label="GST Number" value={dealer.gstNumber} />
          <InfoBlock label="Monthly Purchase" value={dealer.monthlyPurchase} />
          <InfoBlock label="Existing Brands" value={dealer.existingBrands} />
          <InfoBlock label="Interested Products" value={dealer.interestedProducts} />
          <InfoBlock label="Sales Representative" value={dealer.salesRepresentative} />
          <InfoBlock label="Created" value={formatDate(dealer.createdAt)} />
          <InfoBlock label="Address" value={dealer.address} full />
          <InfoBlock label="Notes" value={dealer.notes} full />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <p className="mb-3 text-sm font-extrabold text-slate-700">Change Status</p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status.value}
                type="button"
                onClick={() => onStatusChange(status.value)}
                className={`rounded-xl px-4 py-2.5 text-sm font-extrabold ring-1 transition ${
                  dealer.status === status.value
                    ? statusClasses(status.value)
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-100 px-5 font-extrabold text-red-600 hover:bg-red-50"
          >
            <Trash2 size={17} /> Delete Dealer
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 font-extrabold text-white hover:bg-blue-700"
          >
            <Edit3 size={17} /> Edit Dealer
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4">
      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-slate-400">
        <Icon size={14} /> {label}
      </div>
      <p className="mt-2 break-words font-bold text-slate-800">{value || "—"}</p>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={`rounded-2xl bg-slate-50 p-4 ${full ? "sm:col-span-2" : ""}`}>
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-2 whitespace-pre-wrap break-words font-semibold text-slate-700">{value || "—"}</p>
    </div>
  );
}

function ModalShell({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div
        className={`flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem] ${
          wide ? "max-w-4xl" : "max-w-3xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
          <h2 className="text-xl font-black text-slate-950 sm:text-2xl">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">{children}</div>
      </div>
    </div>
  );
}
