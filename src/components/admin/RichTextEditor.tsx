"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Describe the product details, highlights, fabric, fit, and care instructions...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isCodeView, setIsCodeView] = useState(false);
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  });

  // Track if user is currently typing to prevent resetting cursor
  const isTypingRef = useRef(false);

  // Sync incoming value to editor innerHTML
  useEffect(() => {
    if (editorRef.current && !isTypingRef.current) {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value]);

  // Update active formatting states based on current selection
  const updateActiveStates = useCallback(() => {
    if (typeof document === "undefined") return;
    try {
      setActiveFormats({
        bold: document.queryCommandState("bold"),
        italic: document.queryCommandState("italic"),
        underline: document.queryCommandState("underline"),
        strikeThrough: document.queryCommandState("strikeThrough"),
        insertUnorderedList: document.queryCommandState("insertUnorderedList"),
        insertOrderedList: document.queryCommandState("insertOrderedList"),
        justifyLeft: document.queryCommandState("justifyLeft"),
        justifyCenter: document.queryCommandState("justifyCenter"),
        justifyRight: document.queryCommandState("justifyRight"),
      });
    } catch {
      // Ignore queryCommandState errors if not supported
    }
  }, []);

  const handleInput = () => {
    if (!editorRef.current) return;
    isTypingRef.current = true;
    const html = editorRef.current.innerHTML;
    // Clean up empty editor markup
    const cleanHtml = html === "<p><br></p>" || html === "<br>" ? "" : html;
    onChange(cleanHtml);
    updateActiveStates();
    setTimeout(() => {
      isTypingRef.current = false;
    }, 100);
  };

  const exec = (command: string, arg: string | undefined = undefined) => {
    if (typeof document === "undefined") return;
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  };

  const handleFormatBlock = (tag: string) => {
    editorRef.current?.focus();
    document.execCommand("formatBlock", false, tag);
    handleInput();
  };

  const handleInsertLink = () => {
    const url = window.prompt("Enter link URL (e.g. https://...):");
    if (url && url.trim()) {
      exec("createLink", url.trim());
    }
  };

  // Quick insert template helper for common ecommerce product details
  const handleInsertTemplate = (type: "features" | "care" | "specs") => {
    let templateHtml = "";
    if (type === "features") {
      templateHtml = `
        <h3>Key Features</h3>
        <ul>
          <li>Premium breathable fabric tailored for all-day comfort.</li>
          <li>Reinforced high-stress seams for enhanced longevity.</li>
          <li>Modern slim fit silhouette with contemporary detailing.</li>
        </ul>
      `;
    } else if (type === "care") {
      templateHtml = `
        <h3>Fabric & Care</h3>
        <ul>
          <li><strong>Material:</strong> 100% Organic Combed Cotton</li>
          <li><strong>Wash Care:</strong> Machine wash cold with like colors</li>
          <li><strong>Drying:</strong> Tumble dry low or line dry in shade</li>
          <li><strong>Iron:</strong> Warm iron if needed; do not bleach</li>
        </ul>
      `;
    } else if (type === "specs") {
      templateHtml = `
        <h3>Size & Fit Guide</h3>
        <p>Regular fit — designed to fit comfortably through the chest and waist. Model is 6'1" wearing size L.</p>
      `;
    }

    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("insertHTML", false, templateHtml);
      handleInput();
    }
  };

  // Compute word and character count
  const textContent = (editorRef.current?.innerText || "").trim();
  const wordCount = textContent ? textContent.split(/\s+/).length : 0;
  const charCount = textContent.length;

  return (
    <div className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-xs focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all ${className}`}>
      {/* Top Toolbar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-2 flex flex-wrap items-center justify-between gap-2 select-none">
        {/* Formatting Actions */}
        <div className="flex flex-wrap items-center gap-1">
          {/* Headings Selector */}
          <select
            onChange={(e) => {
              handleFormatBlock(e.target.value);
              e.target.value = "p";
            }}
            defaultValue="p"
            className="text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
            title="Text Style"
          >
            <option value="p">Paragraph</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="blockquote">Quote</option>
          </select>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => exec("bold")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-black transition-colors cursor-pointer ${
              activeFormats.bold
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Bold (Ctrl+B)"
          >
            B
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => exec("italic")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-serif italic transition-colors cursor-pointer ${
              activeFormats.italic
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Italic (Ctrl+I)"
          >
            I
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => exec("underline")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs underline font-semibold transition-colors cursor-pointer ${
              activeFormats.underline
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Underline (Ctrl+U)"
          >
            U
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => exec("strikeThrough")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs line-through font-semibold transition-colors cursor-pointer ${
              activeFormats.strikeThrough
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Strikethrough"
          >
            S
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Bulleted List */}
          <button
            type="button"
            onClick={() => exec("insertUnorderedList")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
              activeFormats.insertUnorderedList
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Bullet List"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </button>

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => exec("insertOrderedList")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
              activeFormats.insertOrderedList
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Numbered List"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M4.5 4.5v4.5m0 0H3m1.5 0h1.5M3 13.5h3v1.5H4.5a1.5 1.5 0 01-1.5-1.5zM3 18h3v3H3" />
            </svg>
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Align Left */}
          <button
            type="button"
            onClick={() => exec("justifyLeft")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
              activeFormats.justifyLeft
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Align Left"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h10.5m-10.5 5.25h16.5" />
            </svg>
          </button>

          {/* Align Center */}
          <button
            type="button"
            onClick={() => exec("justifyCenter")}
            className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition-colors cursor-pointer ${
              activeFormats.justifyCenter
                ? "bg-violet-600 text-white shadow-xs"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
            }`}
            title="Align Center"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6.75 12h10.5m-10.5 5.25h16.5" />
            </svg>
          </button>

          {/* Insert Link */}
          <button
            type="button"
            onClick={handleInsertLink}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Insert Link"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
          </button>

          {/* Clear Format */}
          <button
            type="button"
            onClick={() => exec("removeFormat")}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Clear Formatting"
          >
            <span className="text-[10px] font-bold">Tx</span>
          </button>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

          {/* Undo / Redo */}
          <button
            type="button"
            onClick={() => exec("undo")}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Undo (Ctrl+Z)"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => exec("redo")}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Redo (Ctrl+Y)"
          >
            <svg className="w-3.5 h-3.5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
            </svg>
          </button>
        </div>

        {/* Right Side: Quick Templates & View Mode */}
        <div className="flex items-center gap-1.5">
          {/* Quick eCommerce Template Chips */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleInsertTemplate("features")}
              className="px-2 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Insert Features Template"
            >
              + Features
            </button>
            <button
              type="button"
              onClick={() => handleInsertTemplate("care")}
              className="px-2 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Insert Fabric & Care Template"
            >
              + Fabric & Care
            </button>
            <button
              type="button"
              onClick={() => handleInsertTemplate("specs")}
              className="px-2 py-1 rounded-md text-[10px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-violet-500 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Insert Size & Fit Template"
            >
              + Size & Fit
            </button>
          </div>

          <span className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />

          {/* HTML Code / Visual Toggle */}
          <button
            type="button"
            onClick={() => setIsCodeView(!isCodeView)}
            className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              isCodeView
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
            }`}
            title="Toggle Visual / HTML Code Mode"
          >
            <span>{isCodeView ? "Visual Mode" : "<> HTML"}</span>
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="relative">
        {isCodeView ? (
          /* Raw HTML Code View */
          <textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={8}
            className="w-full p-4 font-mono text-xs bg-slate-900 text-emerald-400 focus:outline-none resize-y"
            placeholder="<p>Write raw HTML code here...</p>"
          />
        ) : (
          /* Visual WYSIWYG View */
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onKeyUp={updateActiveStates}
            onMouseUp={updateActiveStates}
            className="min-h-[160px] max-h-[400px] overflow-y-auto p-4 text-xs font-normal text-slate-800 dark:text-slate-200 focus:outline-none leading-relaxed prose prose-sm dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none [&>h2]:text-base [&>h2]:font-bold [&>h2]:mt-2 [&>h2]:mb-1 [&>h3]:text-sm [&>h3]:font-bold [&>h3]:mt-2 [&>h3]:mb-1 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-violet-500 [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-slate-500 [&>a]:text-violet-600 [&>a]:underline"
            data-placeholder={placeholder}
          />
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Clear all description content?")) {
                  onChange("");
                  if (editorRef.current) editorRef.current.innerHTML = "";
                }
              }}
              className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          )}
          <span>Rich Text Editor</span>
        </div>
      </div>
    </div>
  );
}
