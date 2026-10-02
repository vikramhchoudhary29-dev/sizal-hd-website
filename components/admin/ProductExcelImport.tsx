"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { adminFetch } from "@/lib/api/adminToken";
import { Download, FileSpreadsheet, Upload } from "lucide-react";

function text(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function normalizeHeader(value: unknown) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function mapRow(row: Record<string, unknown>) {
  const mapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    mapped[normalizeHeader(key)] = value;
  }
  return mapped;
}

function readSheet(workbook: XLSX.WorkBook, name: string) {
  const sheet = workbook.Sheets[name];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" }).map(mapRow);
}

function value(row: Record<string, unknown>, ...keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== "") return row[key];
  }
  return "";
}

export default function ProductExcelImport({ onImported }: { onImported?: () => void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function downloadTemplate() {
    const products = [
      {
        Name: "Magnus Night Ryder",
        Code: "MNR156",
        Category: "Single Vision",
        "Short Description": "Blue Filter SV Drive Lens",
        "Full Description": "Product description here",
        "Lens Index": "1.56",
        Coating: "Magenta",
        "Image URL": "",
        "Cover Image URL": "",
        "Video URL": "",
        "PDF URL": "",
        Status: "active",
        Featured: "false",
        "SEO Title": "",
        "SEO Description": "",
      },
    ];

    const tableRows = [
      {
        "Product Code": "MNR156",
        Index: "1.56",
        "Product Name": "Magnus Night Ryder",
        "Dia (mm)": "75/65",
        "Coating Colour": "Magenta",
        Description: "Blue Filter SV Drive Lens",
        "Display Order": 0,
      },
    ];

    const workbook = XLSX.utils.book_new();
    const productsSheet = XLSX.utils.json_to_sheet(products);
    const tableSheet = XLSX.utils.json_to_sheet(tableRows);
    productsSheet["!cols"] = [
      { wch: 28 }, { wch: 16 }, { wch: 20 }, { wch: 35 }, { wch: 45 },
      { wch: 12 }, { wch: 22 }, { wch: 45 }, { wch: 45 }, { wch: 45 },
      { wch: 45 }, { wch: 12 }, { wch: 12 }, { wch: 30 }, { wch: 45 },
    ];
    tableSheet["!cols"] = [
      { wch: 20 }, { wch: 12 }, { wch: 30 }, { wch: 15 }, { wch: 24 }, { wch: 55 }, { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(workbook, productsSheet, "Products");
    XLSX.utils.book_append_sheet(workbook, tableSheet, "Product Table");
    XLSX.writeFile(workbook, "sizal-hd-product-import-template.xlsx");
  }

  async function handleFile(file: File) {
    setBusy(true);
    setMessage("");
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const productRows = readSheet(workbook, "Products");
      const tableRows = readSheet(workbook, "Product Table");

      if (!productRows.length) {
        throw new Error('The Excel file must contain a "Products" sheet with at least one row.');
      }

      const products = productRows.map((row) => ({
        name: value(row, "name", "productname"),
        code: value(row, "code", "productcode"),
        category: value(row, "category"),
        shortDescription: value(row, "shortdescription", "description"),
        fullDescription: value(row, "fulldescription"),
        lensIndex: value(row, "lensindex", "index"),
        coating: value(row, "coating"),
        imageUrl: value(row, "imageurl"),
        coverImageUrl: value(row, "coverimageurl"),
        videoUrl: value(row, "videourl"),
        pdfUrl: value(row, "pdfurl"),
        status: value(row, "status") || "active",
        featured: value(row, "featured"),
        seoTitle: value(row, "seotitle"),
        seoDescription: value(row, "seodescription"),
      }));

      const cleanProducts = products.filter((row) => text(row.name) && text(row.code));
      if (!cleanProducts.length) {
        throw new Error("No valid products found. Name and Code are required.");
      }

      const normalizedTableRows = tableRows.map((row) => ({
        productCode: value(row, "productcode", "code"),
        index: value(row, "index"),
        productName: value(row, "productname"),
        dia: value(row, "diammm", "dia"),
        coatingColour: value(row, "coatingcolour", "coatingcolor"),
        description: value(row, "description"),
        displayOrder: value(row, "displayorder"),
      })).filter((row) => text(row.productCode));

      const response = await adminFetch("/api/content/products/import", {
        method: "POST",
        body: JSON.stringify({ products: cleanProducts, tableRows: normalizedTableRows }),
      });
      const json = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(json.error || "Product import failed");

      setMessage(`Imported successfully: ${json.created || 0} created, ${json.updated || 0} updated, ${json.rowsImported || 0} table rows.`);
      onImported?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Product import failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <section className="rounded-3xl border border-blue-100 bg-blue-50/60 p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white"><FileSpreadsheet size={20} /></div>
            <div>
              <h2 className="text-xl font-black">Bulk Product Import</h2>
              <p className="text-sm text-slate-600">Import products and their long information tables from Excel.</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Use two sheets: <strong>Products</strong> for one row per product and <strong>Product Table</strong> for any number of rows per product. Match them using Product Code. The table uses <strong>Description</strong> instead of Power Range.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={downloadTemplate} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800">
            <Download size={16} /> Download Template
          </button>
          <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:opacity-60">
            <Upload size={16} /> {busy ? "Importing..." : "Import Excel"}
          </button>
          <input ref={inputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void handleFile(file); }} />
        </div>
      </div>

      {message && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
    </section>
  );
}
