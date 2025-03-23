"use client";

import { useState, useEffect } from "react";
import PostPreview from "./PostPreview";
import InputForm from "./InputForm"

export default function AdminDashboard() {
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [prompt, setPrompt] = useState(
    "Provide the latest tech news, tools, and trending tech stacks in 50 words with emojis."
  );
  const [loading, setLoading] = useState(false);

  const generateContent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.content) {
        setContent(data.content);
        setTimeLeft(5);
      } else {
        setContent("Error: No content generated.");
      }
    } catch (error) {
      console.error("Generation error:", error);
      setContent("Error: Failed to generate content.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 60000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-[#D8F3DC]">Linkedin AI Agent</h1>
      <InputForm onGenerate={generateContent} setPrompt={setPrompt} loading={loading} />
      {content && <PostPreview content={content} />}
      {timeLeft > 0 && <p className="mt-4 text-sm text-[#D8F3DC]">Time left: {timeLeft} min</p>}
    </div>
  );
}