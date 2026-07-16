"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Heading1,
  Heading2,
  Quote,
  X,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

export default function NewArticlePage() {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState<"PUBLISHED" | "DRAFT" | null>(null);

  const exec = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  };

  const submitArticle = async (status: "PUBLISHED" | "DRAFT") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add an article");
      router.push("/login");
      return;
    }

    const content = editorRef.current?.innerHTML.trim() || "";
    const plainText = editorRef.current?.innerText.trim() || "";

    if (!title.trim() || !summary.trim() || !plainText) {
      toast.error("Please fill in the title, summary, and content");
      return;
    }

    setSubmitting(status);

    try {
      const response = await fetch(API_ENDPOINTS.ARTICLES, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, summary, content, status }),
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("Please login to add an article");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Server response:", response.status, errorData);
        throw new Error(
          errorData.message || errorData.error || "Failed to create article"
        );
      }

      toast.success(
        status === "DRAFT" ? "Article saved as draft" : "Article published"
      );
      router.push("/articles");
    } catch (err: any) {
      console.error("Error creating article:", err);
      toast.error(err.message || "Failed to create article");
    } finally {
      setSubmitting(null);
    }
  };

  const toolbarButtons: {
    icon: LucideIcon;
    label: string;
    action: () => void;
  }[] = [
    { icon: Bold, label: "Bold", action: () => exec("bold") },
    { icon: Italic, label: "Italic", action: () => exec("italic") },
    { icon: Underline, label: "Underline", action: () => exec("underline") },
    { icon: Heading1, label: "Heading 1", action: () => exec("formatBlock", "H1") },
    { icon: Heading2, label: "Heading 2", action: () => exec("formatBlock", "H2") },
    { icon: Quote, label: "Quote", action: () => exec("formatBlock", "BLOCKQUOTE") },
    { icon: List, label: "Bullet List", action: () => exec("insertUnorderedList") },
    { icon: ListOrdered, label: "Numbered List", action: () => exec("insertOrderedList") },
    { icon: AlignLeft, label: "Align Left", action: () => exec("justifyLeft") },
    { icon: AlignCenter, label: "Align Center", action: () => exec("justifyCenter") },
    { icon: AlignRight, label: "Align Right", action: () => exec("justifyRight") },
    { icon: Undo2, label: "Undo", action: () => exec("undo") },
    { icon: Redo2, label: "Redo", action: () => exec("redo") },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <button
          onClick={() => router.push("/articles")}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title="Close"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => submitArticle("DRAFT")}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting === "DRAFT" && <Loader2 size={14} className="animate-spin" />}
            Save as Draft
          </button>
          <button
            type="button"
            disabled={submitting !== null}
            onClick={() => submitArticle("PUBLISHED")}
            className="px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-semibold hover:bg-green-800 transition disabled:opacity-50 flex items-center gap-2"
          >
            {submitting === "PUBLISHED" && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Publish
          </button>
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 bg-white border-b border-gray-200 overflow-x-auto shrink-0">
        {toolbarButtons.map(({ icon: Icon, label, action }, i) => (
          <button
            key={label}
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              action();
            }}
            title={label}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-green-700 transition-colors"
          >
            <Icon size={18} />
          </button>
        ))}
      </div>

      {/* Document Canvas */}
      <div className="flex-1 overflow-y-auto py-10 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 min-h-full p-10 md:p-16">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full text-4xl font-bold text-gray-900 placeholder-gray-300 focus:outline-none mb-4"
          />

          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Add a short summary of your article..."
            className="w-full text-lg text-gray-500 placeholder-gray-300 focus:outline-none mb-8 pb-6 border-b border-gray-100"
          />

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            data-placeholder="Write your article here..."
            className="editor-content min-h-[50vh] text-gray-800 text-base leading-relaxed focus:outline-none"
          />
        </div>
      </div>

      <style jsx global>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #d1d5db;
        }
        .editor-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .editor-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }
        .editor-content blockquote {
          border-left: 3px solid #16a34a;
          padding-left: 1rem;
          color: #4b5563;
          font-style: italic;
          margin: 1rem 0;
        }
        .editor-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .editor-content ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
      `}</style>
    </div>
  );
}
