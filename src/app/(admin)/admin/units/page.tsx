"use client";

import React, { useState, useEffect } from "react";
import { getUnits, saveUnits, Unit } from "@/lib/db";

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editSymbol, setEditSymbol] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    setUnits(getUnits());
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !symbol.trim()) return;

    const now = new Date().toISOString().slice(0, 10);
    const newUnit: Unit = {
      id: Math.max(0, ...units.map((u) => u.id)) + 1,
      name: name.trim(),
      symbol: symbol.trim().toLowerCase(),
      created_at: now,
    };

    const updated = [...units, newUnit];
    setUnits(updated);
    saveUnits(updated);
    setName("");
    setSymbol("");
    showSuccess(`Unit "${newUnit.name}" (${newUnit.symbol}) created!`);
  };

  const handleDelete = (id: number, unitName: string) => {
    if (!confirm(`Delete unit "${unitName}"? This may affect existing product variants.`)) return;
    const updated = units.filter((u) => u.id !== id);
    setUnits(updated);
    saveUnits(updated);
    showSuccess(`Unit "${unitName}" deleted.`);
  };

  const startEdit = (unit: Unit) => {
    setEditingId(unit.id);
    setEditName(unit.name);
    setEditSymbol(unit.symbol);
  };

  const saveEdit = () => {
    if (!editName.trim() || !editSymbol.trim() || editingId === null) return;
    const updated = units.map((u) =>
      u.id === editingId
        ? { ...u, name: editName.trim(), symbol: editSymbol.trim().toLowerCase() }
        : u
    );
    setUnits(updated);
    saveUnits(updated);
    setEditingId(null);
    showSuccess(`Unit updated to "${editName}".`);
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Product Units
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
            Manage measurement units used across product variants (pcs, kg, L…).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-2.5">
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{units.length}</span>
          <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400">Units</span>
        </div>
      </div>

      {/* Grid: List + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Units Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Active Units
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
              Measurement units available for product variants.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-6 font-semibold">Unit Name</th>
                  <th className="py-3.5 px-6 font-semibold">Symbol</th>
                  <th className="py-3.5 px-6 font-semibold">Created</th>
                  <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {units.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-slate-400 font-medium">
                      No units yet.
                    </td>
                  </tr>
                )}
                {units.map((unit) => (
                  <tr
                    key={unit.id}
                    className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6">
                      {editingId === unit.id ? (
                        <input
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                          className="bg-slate-50 dark:bg-slate-950 border border-violet-400 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
                        />
                      ) : (
                        <span className="font-bold text-slate-900 dark:text-white">{unit.name}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      {editingId === unit.id ? (
                        <input
                          value={editSymbol}
                          onChange={(e) => setEditSymbol(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingId(null); }}
                          className="bg-slate-50 dark:bg-slate-950 border border-violet-400 rounded-lg px-3 py-1.5 text-xs font-bold text-violet-700 dark:text-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500 w-24"
                          placeholder="symbol"
                        />
                      ) : (
                        <span className="inline-flex items-center bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 font-bold px-2.5 py-1 rounded-lg">
                          {unit.symbol}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-400 dark:text-slate-500">
                      {unit.created_at}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {editingId === unit.id ? (
                          <>
                            <button
                              onClick={saveEdit}
                              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-colors cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(unit)}
                              className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(unit.id, unit.name)}
                              className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-300 transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Unit Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit sticky top-6">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              Create Unit
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              Add a new measurement unit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Unit Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kilogram"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Symbol <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. kg"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Unit
            </button>
          </form>

          {/* Example reference */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Examples</p>
            <div className="space-y-1.5">
              {[
                { name: "Piece", symbol: "pcs" },
                { name: "Kilogram", symbol: "kg" },
                { name: "Gram", symbol: "g" },
                { name: "Liter", symbol: "L" },
                { name: "Milliliter", symbol: "ml" },
              ].map((ex) => (
                <div key={ex.symbol} className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">{ex.name}</span>
                  <span className="text-xs font-mono font-bold text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/30 px-2 py-0.5 rounded-md">
                    {ex.symbol}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-2">
          <span className="text-emerald-400 dark:text-emerald-600 font-black text-sm">✓</span>
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
