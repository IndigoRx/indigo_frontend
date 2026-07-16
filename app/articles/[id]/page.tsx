"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import DOMPurify from "dompurify";
import Navbar from "../../components/Navbar/page";
import Footer from "../../components/SubComponents/Footer";
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

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_ENDPOINTS.ARTICLE_BY_ID(Number(params.id)));

        if (!response.ok) {
          throw new Error("Failed to fetch article");
        }

        const data = await response.json();
        setArticle(data.data ?? data);
      } catch (err: any) {
        console.error("Error fetching article:", err);
        setError(err.message || "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchArticle();
    }
  }, [params.id]);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => router.push("/articles")}
            className="text-sm text-green-700 hover:text-green-800 font-medium mb-8"
          >
            &larr; Back to Articles
          </button>

          {loading && (
            <p className="text-gray-500 text-center py-10">Loading article...</p>
          )}

          {!loading && error && (
            <p className="text-red-600 text-center py-10">{error}</p>
          )}

          {!loading && !error && article && (
            <article className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              <div className="flex items-center justify-between text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                <span>{article.doctor?.name}</span>
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>

              <p className="text-gray-600 text-lg mb-6">{article.summary}</p>

              <div
                className="article-content text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(article.content),
                }}
              />
            </article>
          )}
        </div>
      </div>

      <Footer />

      <style jsx global>{`
        .article-content h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1.5rem 0 0.75rem;
        }
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1.25rem 0 0.5rem;
        }
        .article-content blockquote {
          border-left: 3px solid #16a34a;
          padding-left: 1rem;
          color: #4b5563;
          font-style: italic;
          margin: 1rem 0;
        }
        .article-content ul {
          list-style: disc;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .article-content ol {
          list-style: decimal;
          padding-left: 1.5rem;
          margin: 0.75rem 0;
        }
        .article-content p {
          margin: 0.75rem 0;
        }
      `}</style>
    </>
  );
}
