"use client";

import { useState, useEffect } from "react";
import InputForm from "./InputForm";
import PostPreview from "./PostPreview";

export default function AdminDashboard() {
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [prompt, setPrompt] = useState(
    "Provide the latest tech news, latest tools, and trending tech stacks in 50 words with emojis."
  );

  const generateContent = async () => {
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
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined; 
    if (timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(timeLeft - 1), 60000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <InputForm onGenerate={generateContent} setPrompt={setPrompt} />
      {content && (
        <div>
          <PostPreview content={content} />
          <p className="mt-2 text-sm">Word count: {content.split(" ").length}</p>
        </div>
      )}
      {timeLeft > 0 && <p className="mt-4">Time left: {timeLeft} min</p>}
    </div>
  );
}