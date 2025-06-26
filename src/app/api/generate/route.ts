import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Invalid topic provided." },
        { status: 400 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000/", 
        "X-Title": "Blog Generator",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a professional blog writer. Use H2 headings, concise paragraphs, bullet points when helpful, and clear formatting. End with a strong conclusion.",
          },
          {
            role: "user",
            content: `Write a detailed blog on: ${topic}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "Failed to generate blog." },
        { status: response.status }
      );
    }

    const blog = data?.choices?.[0]?.message?.content;
    if (!blog) {
      return NextResponse.json(
        { error: "No content returned by the model." },
        { status: 500 }
      );
    }

    return NextResponse.json({ blog });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}
