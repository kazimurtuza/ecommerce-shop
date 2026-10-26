"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getAttributes,
  saveAttributes,
  Attribute,
  AttributeValue,
} from "@/lib/db";

const ATTRIBUTE_TYPES = [
  { value: "select", label: "Select (Dropdown)" },
  { value: "color", label: "Color (Color Swatch)" },
  { value: "text", label: "Text (Free Input)" },
] as const;

type AttrType = "select" | "color" | "text";

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [expandedAttr, setExpandedAttr] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- New Attribute Form ---
  const [newAttr, setNewAttr] = useState({ name: "", type: "select" as AttrType });
  const [newAttrError, setNewAttrError] = useState("");

  // --- New Value Form (per attribute) ---
  const [newValueInputs, setNewValueInputs] = useState<
    Record<number, { value: string; color_hex: string }>
  >({});

  // --- Inline Edit Attribute ---
  const [editingAttrId, setEditingAttrId] = useState<number | null>(null);
  const [editAttrName, setEditAttrName] = useState("");
  const editAttrRef = useRef<HTMLInputElement>(null);

  // --- Inline Edit Value ---
  const [editingValueId, setEditingValueId] = useState<number | null>(null);
  const [editValueText, setEditValueText] = useState("");
  const [editValueHex, setEditValueHex] = useState("");

  useEffect(() => {
    setAttributes(getAttributes());
  }, []);

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ── Attribute helpers ──────────────────────────────────────────────────────

  const toSlug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleCreateAttribute = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newAttr.name.trim();
    if (!name) { setNewAttrError("Name is required."); return; }
    if (attributes.some((a) => a.name.toLowerCase() === name.toLowerCase())) {
      setNewAttrError("An attribute with this name already exists."); return;
    }
    const now = new Date().toISOString().slice(0, 10);
    const newId = Math.max(0, ...attributes.map((a) => a.id)) + 1;
    const created: Attribute = {
      id: newId,
      name,
      slug: toSlug(name),
      type: newAttr.type,
      values: [],
      created_at: now,
      updated_at: now,
    };
    const updated = [...attributes, created];
    setAttributes(updated);
    saveAttributes(updated);
    setNewAttr({ name: "", type: "select" });
    setNewAttrError("");
    setExpandedAttr(newId);
    showSuccess(`Attribute "${name}" created.`);
  };

  const handleDeleteAttribute = (id: number, name: string) => {
    if (!confirm(`Delete attribute "${name}" and all its values?`)) return;
    const updated = attributes.filter((a) => a.id !== id);
    setAttributes(updated);
    saveAttributes(updated);
    showSuccess(`Attribute "${name}" deleted.`);
  };

  const startEditAttr = (attr: Attribute) => {
    setEditingAttrId(attr.id);
    setEditAttrName(attr.name);
    setTimeout(() => editAttrRef.current?.focus(), 50);
  };

  const saveEditAttr = (id: number) => {
    const name = editAttrName.trim();
    if (!name) { setEditingAttrId(null); return; }
    const now = new Date().toISOString().slice(0, 10);
    const updated = attributes.map((a) =>
      a.id === id ? { ...a, name, slug: toSlug(name), updated_at: now } : a
    );
    setAttributes(updated);
    saveAttributes(updated);
    setEditingAttrId(null);
    showSuccess(`Attribute renamed to "${name}".`);
  };

  // ── Value helpers ──────────────────────────────────────────────────────────

  const handleAddValue = (attrId: number) => {
    const input = newValueInputs[attrId];
    if (!input?.value?.trim()) return;

    const attr = attributes.find((a) => a.id === attrId);
    if (!attr) return;

    const now = new Date().toISOString().slice(0, 10);
    const maxId = Math.max(
      0,
      ...attributes.flatMap((a) => a.values.map((v) => v.id))
    );

    const newVal: AttributeValue = {
      id: maxId + 1,
      attribute_id: attrId,
      value: input.value.trim(),
      slug: toSlug(input.value.trim()),
      color_hex: input.color_hex || undefined,
      created_at: now,
    };

    const updated = attributes.map((a) =>
      a.id === attrId
        ? { ...a, values: [...a.values, newVal], updated_at: now }
        : a
    );
    setAttributes(updated);
    saveAttributes(updated);
    setNewValueInputs((prev) => ({
      ...prev,
      [attrId]: { value: "", color_hex: "" },
    }));
    showSuccess(`Value "${newVal.value}" added.`);
  };

  const handleDeleteValue = (attrId: number, valueId: number, valName: string) => {
    if (!confirm(`Delete value "${valName}"?`)) return;
    const now = new Date().toISOString().slice(0, 10);
    const updated = attributes.map((a) =>
      a.id === attrId
        ? {
          ...a,
          values: a.values.filter((v) => v.id !== valueId),
          updated_at: now,
        }
        : a
    );
    setAttributes(updated);
    saveAttributes(updated);
    showSuccess(`Value "${valName}" deleted.`);
  };

  const startEditValue = (v: AttributeValue) => {
    setEditingValueId(v.id);
    setEditValueText(v.value);
    setEditValueHex(v.color_hex || "");
  };

  const saveEditValue = (attrId: number, valueId: number) => {
    const text = editValueText.trim();
    if (!text) { setEditingValueId(null); return; }
    const now = new Date().toISOString().slice(0, 10);
    const updated = attributes.map((a) =>
      a.id === attrId
        ? {
          ...a,
          updated_at: now,
          values: a.values.map((v) =>
            v.id === valueId
              ? { ...v, value: text, slug: toSlug(text), color_hex: editValueHex || undefined }
              : v
          ),
        }
        : a
    );
    setAttributes(updated);
    saveAttributes(updated);
    setEditingValueId(null);
    showSuccess(`Value updated to "${text}".`);
  };

  const typeIcon = (type: AttrType) => {
    if (type === "color") return "🎨";
    if (type === "text") return "📝";
    return "☰";
  };

  const typeBadgeClass = (type: AttrType) => {
    if (type === "color") return "bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-800";
    if (type === "text") return "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    return "bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800";
  };

  return (
    <div className="space-y-8 font-sans transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Product Attributes
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5">
            Define attributes (Color, Size, RAM…) and their possible values used across product variants.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl px-4 py-2.5">
          <span className="text-2xl font-black text-violet-600 dark:text-violet-400">{attributes.length}</span>
          <span className="text-xs font-bold text-violet-500 dark:text-violet-400">Attributes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Left: Attributes List ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">
          {attributes.length === 0 && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500">
              <p className="text-4xl mb-3">🏷️</p>
              <p className="font-bold">No attributes yet. Create one →</p>
            </div>
          )}

          {attributes.map((attr) => {
            const isExpanded = expandedAttr === attr.id;
            const valInput = newValueInputs[attr.id] ?? { value: "", color_hex: "" };

            return (
              <div
                key={attr.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Attribute Header Row */}
                <div className="flex items-center gap-3 px-6 py-4">
                  {/* Expand toggle */}
                  <button
                    onClick={() => setExpandedAttr(isExpanded ? null : attr.id)}
                    className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/40 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer shrink-0"
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                      fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Name (editable inline) */}
                  <div className="flex-1 min-w-0">
                    {editingAttrId === attr.id ? (
                      <input
                        ref={editAttrRef}
                        value={editAttrName}
                        onChange={(e) => setEditAttrName(e.target.value)}
                        onBlur={() => saveEditAttr(attr.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEditAttr(attr.id);
                          if (e.key === "Escape") setEditingAttrId(null);
                        }}
                        className="text-sm font-extrabold text-slate-900 dark:text-white bg-transparent border-b-2 border-violet-500 focus:outline-none w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                          {typeIcon(attr.type)} {attr.name}
                        </span>
                        <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-md uppercase tracking-wider ${typeBadgeClass(attr.type)}`}>
                          {attr.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">/{attr.slug}</span>
                      </div>
                    )}
                  </div>

                  {/* Value count badge */}
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
                    {attr.values.length} value{attr.values.length !== 1 ? "s" : ""}
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEditAttr(attr)}
                      title="Rename attribute"
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAttribute(attr.id, attr.name)}
                      title="Delete attribute"
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Attribute Values Panel */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 px-6 py-5 space-y-4">
                    {/* Values list */}
                    {attr.values.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {attr.values.map((v) =>
                          editingValueId === v.id ? (
                            // Inline edit form
                            <div
                              key={v.id}
                              className="flex items-center gap-2 bg-white dark:bg-slate-900 border-2 border-violet-400 rounded-xl px-2 py-1 shadow-sm"
                            >
                              {attr.type === "color" && (
                                <input
                                  type="color"
                                  value={editValueHex}
                                  onChange={(e) => setEditValueHex(e.target.value)}
                                  className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent"
                                />
                              )}
                              <input
                                autoFocus
                                value={editValueText}
                                onChange={(e) => setEditValueText(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEditValue(attr.id, v.id);
                                  if (e.key === "Escape") setEditingValueId(null);
                                }}
                                className="text-xs font-bold bg-transparent border-none outline-none w-24 text-slate-800 dark:text-white"
                              />
                              <button
                                onClick={() => saveEditValue(attr.id, v.id)}
                                className="text-emerald-500 hover:text-emerald-600 cursor-pointer"
                              >
                                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setEditingValueId(null)}
                                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                              >
                                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <div
                              key={v.id}
                              className="group flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-violet-400 dark:hover:border-violet-600 transition-colors"
                            >
                              {attr.type === "color" && v.color_hex && (
                                <span
                                  className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0"
                                  style={{ backgroundColor: v.color_hex }}
                                />
                              )}
                              <span>{v.value}</span>
                              <button
                                onClick={() => startEditValue(v)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-violet-500 transition-all cursor-pointer ml-0.5"
                                title="Edit"
                              >
                                <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => handleDeleteValue(attr.id, v.id, v.value)}
                                className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all cursor-pointer"
                                title="Delete"
                              >
                                <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 font-medium italic">
                        No values yet. Add below.
                      </p>
                    )}

                    {/* Add value inline form */}
                    <div className="flex items-center gap-2 pt-1">
                      {attr.type === "color" && (
                        <input
                          type="color"
                          value={valInput.color_hex || "#6d28d9"}
                          onChange={(e) =>
                            setNewValueInputs((prev) => ({
                              ...prev,
                              [attr.id]: { ...prev[attr.id], color_hex: e.target.value },
                            }))
                          }
                          className="w-9 h-9 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900"
                          title="Pick color"
                        />
                      )}
                      <input
                        type="text"
                        value={valInput.value ?? ""}
                        onChange={(e) =>
                          setNewValueInputs((prev) => ({
                            ...prev,
                            [attr.id]: { ...prev[attr.id], value: e.target.value },
                          }))
                        }
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddValue(attr.id); } }}
                        placeholder={attr.type === "color" ? "e.g. Crimson Red" : attr.type === "text" ? "e.g. Custom value" : "e.g. XL"}
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
                      />
                      <button
                        onClick={() => handleAddValue(attr.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-violet-600/25 transition-colors cursor-pointer shrink-0"
                      >
                        <svg className="w-3.5 h-3.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add Value
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Right: Create Attribute Form ──────────────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 h-fit sticky top-6">
          <div className="pb-5 border-b border-slate-100 dark:border-slate-800 mb-5">
            <h2 className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
              New Attribute
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">
              Create a new variant attribute for products.
            </p>
          </div>

          <form onSubmit={handleCreateAttribute} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Attribute Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={newAttr.name}
                onChange={(e) => { setNewAttr((p) => ({ ...p, name: e.target.value })); setNewAttrError(""); }}
                placeholder="e.g. Color, Size, RAM"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
              />
              {newAttrError && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5">{newAttrError}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Input Type
              </label>
              <div className="space-y-2">
                {ATTRIBUTE_TYPES.map((t) => (
                  <label
                    key={t.value}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${newAttr.type === t.value
                      ? "border-violet-500 bg-violet-50 dark:bg-violet-950/30"
                      : "border-slate-200 dark:border-slate-700 "
                      }`}
                  >
                    <input
                      type="radio"
                      value={t.value}
                      checked={newAttr.type === t.value}
                      onChange={() => setNewAttr((p) => ({ ...p, type: t.value as AttrType }))}
                      className="accent-violet-600 w-3.5 h-3.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t.label}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Slug preview */}
            {newAttr.name && (
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Slug: </span>
                <span className="text-xs font-mono">
                  {toSlug(newAttr.name)}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-xs font-bold text-white shadow-md shadow-violet-600/25 hover:bg-violet-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Attribute
            </button>
          </form>

          {/* Quick guide */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">How it works</p>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-start gap-1.5">
                <span className="text-violet-500 font-bold">1.</span>
                Create attributes (e.g. Color, Size)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-violet-500 font-bold">2.</span>
                Add values per attribute (e.g. Red, Blue)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-violet-500 font-bold">3.</span>
                Select which attributes your product uses
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-violet-500 font-bold">4.</span>
                Assign values to each variant
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 dark:border-slate-200 flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <span className="text-emerald-400 dark:text-emerald-600 font-black text-sm">✓</span>
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}
