"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";
import { API_ENDPOINTS } from "@/app/api/config";

interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  doctor: {
    id: number;
    username: string;
    name: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticlesResponse {
  success: boolean;
  data: Article[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export default function ArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL(API_ENDPOINTS.ARTICLES);
        url.searchParams.append("page", "0");
        url.searchParams.append("size", "10");

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error("Failed to fetch articles");
        }

        const data: ArticlesResponse = await response.json();
        setArticles(data.data);
      } catch (err: any) {
        console.error("Error fetching articles:", err);
        setError(err.message || "Failed to load articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [router]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Articles
              </h1>
              <p className="text-gray-600 mt-2">
                Insights and updates from the IndigoRx community.
              </p>
            </div>

            <Link
              href="/articles/new"
              className="bg-green-700 text-white rounded-xl px-6 py-3 font-semibold hover:bg-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center"
            >
              Add Your Own Article
            </Link>
          </div>

          {loading && (
            <p className="text-gray-500 text-center py-10">Loading articles...</p>
          )}

          {!loading && error && (
            <p className="text-red-600 text-center py-10">{error}</p>
          )}

          {!loading && !error && articles.length === 0 && (
            <p className="text-gray-500 text-center py-10">
              No articles yet. Be the first to add one!
            </p>
          )}

          {!loading && !error && articles.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 block"
                >
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4">{article.summary}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{article.doctor?.name}</span>
                    <span>
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
