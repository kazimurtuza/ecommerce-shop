"use client";

import React, { useState } from "react";

interface Unit {
  id: number;
  name: string;
  code: string;
  description: string;
}

const INITIAL_UNITS: Unit[] = [
  { id: 1, name: "Piece", code: "pcs", description: "Single item count unit" },
  { id: 2, name: "Kilogram", code: "kg", description: "Weight measurement unit" },
  { id: 3, name: "Pack", code: "pack", description: "Bundle/packet packaging unit" },
  { id: 4, name: "Box", code: "box", description: "Box carton delivery unit" },
];

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>(INITIAL_UNITS);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    const newUnit: Unit = {
      id: Date.now(),
      name,
      code: code.toLowerCase(),
      description,
    };

    setUnits([...units, newUnit]);
    setName("");
    setCode("");
    setDescription("");
    alert(`Unit "${name}" successfully created!`);
  };

  const handleDelete = (id: number, unitName: string) => {
    if (confirm(`Are you sure you want to delete the unit "${unitName}"?`)) {
      setUnits(units.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Product Units</h1>
        <p className="text-slate-550 dark:text-slate-400 text-sm mt-1.5">Manage the measurement units used for product stocks and sales.</p>
      </div>

      {/* Grid: Units List + Add Unit Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Units List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 overflow-hidden">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Active Units</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Existing product stock measurement units.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Unit Name</th>
                  <th className="py-4 px-6 font-semibold">Short Code</th>
                  <th className="py-4 px-6 font-semibold">Description</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {units.map((unit) => (
                  <tr key={unit.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">{unit.name}</td>
                    <td className="py-4 px-6 font-bold text-violet-600 dark:text-violet-400">
                      <span className="bg-violet-50 dark:bg-violet-950/45 px-2.5 py-1 rounded-lg">
                        {unit.code}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-555 dark:text-slate-400">{unit.description || "-"}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(unit.id, unit.name)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-rose-400 dark:hover:text-rose-350 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Unit Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">Create Unit</h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Create a new measurement unit.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Unit Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kilogram"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Short Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. kg"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-550 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Weight measurement"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer"
            >
              Add Unit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
