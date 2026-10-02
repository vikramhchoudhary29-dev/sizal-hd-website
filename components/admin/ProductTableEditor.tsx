"use client";

import { useEffect, useState } from "react";
import type { ProductTableRow } from "@/types/product";
import { Plus, Trash2 } from "lucide-react";

type Props = {
  initialRows?: ProductTableRow[];
};

const emptyRow = (): ProductTableRow => ({
  indexValue: "",
  productName: "",
  dia: "",
  coatingColour: "",
  description: "",
});

export default function ProductTableEditor({ initialRows = [] }: Props) {
  const [rows, setRows] = useState<ProductTableRow[]>(
    initialRows.length ? initialRows : []
  );

  useEffect(() => {
    setRows(initialRows || []);
  }, [initialRows]);

  function update(index: number, field: keyof ProductTableRow, value: string) {
    setRows((current) =>
      current.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row
      )
    );
  }

  function addRow() {
    setRows((current) => [...current, emptyRow()]);
  }

  function removeRow(index: number) {
    setRows((current) => current.filter((_, rowIndex) => rowIndex !== index));
  }

  const serialized = JSON.stringify(
    rows.map((row, index) => ({
      indexValue: row.indexValue || "",
      productName: row.productName || "",
      dia: row.dia || "",
      coatingColour: row.coatingColour || "",
      description: row.description || "",
      displayOrder: index,
    }))
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-6">
      <input type="hidden" name="tableRows" value={serialized} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600">
            Product Range Table
          </p>
          <h2 className="mt-1 text-2xl font-black">Product Information Rows</h2>
          <p className="mt-1 text-sm text-slate-500">
            Add the rows that will appear below the product hero. The last column is Description, not Power Range.
          </p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
        >
          <Plus size={17} /> Add Row
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No table rows yet. Click <strong>Add Row</strong> or use the Excel bulk import.
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-slate-100 text-xs font-black uppercase tracking-wider text-slate-600">
              <tr>
                <th className="px-4 py-3">Index</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">Dia (mm)</th>
                <th className="px-4 py-3">Coating Colour</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index} className="border-t border-slate-100 align-top">
                  <td className="p-3">
                    <input value={row.indexValue} onChange={(e) => update(index, "indexValue", e.target.value)} placeholder="1.56" className="w-28 rounded-lg border px-3 py-2" />
                  </td>
                  <td className="p-3">
                    <input value={row.productName} onChange={(e) => update(index, "productName", e.target.value)} placeholder="Magnus Night Ryder" className="min-w-52 rounded-lg border px-3 py-2" />
                  </td>
                  <td className="p-3">
                    <input value={row.dia} onChange={(e) => update(index, "dia", e.target.value)} placeholder="75/65" className="w-32 rounded-lg border px-3 py-2" />
                  </td>
                  <td className="p-3">
                    <input value={row.coatingColour} onChange={(e) => update(index, "coatingColour", e.target.value)} placeholder="Magenta" className="min-w-40 rounded-lg border px-3 py-2" />
                  </td>
                  <td className="p-3">
                    <textarea value={row.description} onChange={(e) => update(index, "description", e.target.value)} placeholder="Blue Filter SV Drive Lens" rows={2} className="min-w-64 rounded-lg border px-3 py-2" />
                  </td>
                  <td className="p-3">
                    <button type="button" onClick={() => removeRow(index)} className="rounded-lg bg-red-50 p-2.5 text-red-600" aria-label="Remove table row">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
