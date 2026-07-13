"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar/page";
import Footer from "../../components/SubComponents/Footer";
import { API_ENDPOINTS } from "@/app/api/config";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitArticle = async (status: "PUBLISHED" | "DRAFT") => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to add an article");
      router.push("/login");
      return;
    }

    if (!title.trim() || !summary.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);

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
        throw new Error("Failed to create article");
      }

      toast.success(
        status === "DRAFT" ? "Article saved as draft" : "Article published"
      );
      router.push("/articles");
    } catch (err: any) {
      console.error("Error creating article:", err);
      toast.error(err.message || "Failed to create article");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Add Your Own Article
          </h1>

          <form
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-5"
            onSubmit={(e) => e.preventDefault()}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Article title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="A short summary of your article"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Write your article here"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => submitArticle("PUBLISHED")}
                className="bg-green-700 text-white rounded-xl px-6 py-3 font-semibold hover:bg-green-800 transition disabled:opacity-50"
              >
                Publish
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => submitArticle("DRAFT")}
                className="bg-white text-gray-900 border border-gray-300 rounded-xl px-6 py-3 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
