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
    <main className="min-h-screen bg-gray-950 px-4 sm:px-6 md:px-10 py-12 text-gray-100 transition-colors">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          📝 AI Blog Generator
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your blog topic..."
            className="flex-1 text-base md:text-lg border border-gray-700 bg-gray-800 text-gray-100 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg shadow-md transition-all ${
              isLoading
                ? "bg-blue-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500"
            } text-white font-medium`}
            autoFocus
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate"
            )}
          </button>
        </div>

        <div className="mt-8">
          {isLoading && !displayedContent && (
            <div className="flex items-center gap-2 text-gray-400">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generating your blog...</span>
            </div>
          )}

          {(displayedContent || isTyping) && (
            <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-md whitespace-pre-line">
              {displayedContent.split("\n").map((line, idx) => {
                const formatBoldText = (text: string) =>
                  text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

                if (line.match(/^#{3,}\s*/)) {
                  return (
                    <h3
                      key={idx}
                      className="text-lg font-semibold mt-3 mb-2 text-blue-300"
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
                      className="text-xl font-semibold mt-4 mb-2 text-blue-400"
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
                      className="text-2xl font-bold mt-6 mb-3 text-blue-500"
                      dangerouslySetInnerHTML={{
                        __html: formatBoldText(line.replace(/^#{1,}\s*/, "")),
                      }}
                    />
                  );
                }

                return (
                  <p
                    key={idx}
                    className="mb-3 leading-relaxed text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: formatBoldText(line),
                    }}
                  />
                );
              })}
              {isTyping && (
                <span className="inline-block w-2 h-4 ml-1 bg-blue-500 animate-pulse"></span>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}