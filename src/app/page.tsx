"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [blogContent, setBlogContent] = useState("");
  const [displayedContent, setDisplayedContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsLoading(true);
    setBlogContent("");
    setDisplayedContent("");
    setIsTyping(false);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();
      setBlogContent(data.blog);
    } catch (err) {
      console.error("Error Generating blog:", err);
      setBlogContent("❌ Failed to generate blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (blogContent && !isLoading) {
      setIsTyping(true);
      setDisplayedContent("");
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < blogContent.length) {
          setDisplayedContent(blogContent.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 8);

      return () => clearInterval(typeInterval);
    }
  }, [blogContent, isLoading]);

  return (
    <main className="min-h-[44px] bg-white dark:bg-black px-4 sm:px-6 md:px-10 py-12 text-black dark:text-white transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
          📝 AI Blog Generator
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your blog topic..."
            className="flex-1 text-base md:text-lg border border-gray-300 dark:border-gray-600 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={handleGenerate}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 shadow-md transition-all"
          autoFocus>
            {isLoading ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-8">
          {isLoading && (
            <p className="text-gray-500 animate-pulse text-base">
              Generating Blog...
            </p>
          )}

          {(displayedContent || isTyping) && (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-md whitespace-pre-line">
              {displayedContent.split("\n").map((line, idx) => {
                const formatBoldText = (text: string) =>
                  text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

                if (line.match(/^#{3,}\s*/)) {
                  return (
                    <h3
                      key={idx}
                      className="text-lg font-semibold mt-3 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: formatBoldText(line.replace(/^#{3,}\s*/, "")),
                      }}
                    />
                  );
                }
                if (line.match(/^#{2}\s*/)) {
                  return (
                    <h2
                      key={idx}
                      className="text-xl font-semibold mt-4 mb-2"
                      dangerouslySetInnerHTML={{
                        __html: formatBoldText(line.replace(/^#{2,}\s*/, "")),
                      }}
                    />
                  );
                }
                if (line.match(/^#{1}\s*/)) {
                  return (
                    <h1
                      key={idx}
                      className="text-2xl font-bold mt-6 mb-3"
                      dangerouslySetInnerHTML={{
                        __html: formatBoldText(line.replace(/^#{1,}\s*/, "")),
                      }}
                    />
                  );
                }

                return (
                  <p
                    key={idx}
                    className="mb-3 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: formatBoldText(line),
                    }}
                  />
                );
              })}
              {isTyping && (
                <span className="inline-block animate-pulse ml-1">...</span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
