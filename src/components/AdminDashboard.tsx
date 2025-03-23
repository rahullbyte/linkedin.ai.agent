"use client";

import { useState, useEffect } from "react";
import PostPreview from "./PostPreview";
import InputForm from "./InputForm";

export default function AdminDashboard() {
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [shareTimeIST, setShareTimeIST] = useState("");
  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch("/api/prompts");
        const data = await response.json();
        setPrompts(data.prompts);
      } catch (error) {
        console.error("Error fetching prompts:", error);
        setPrompts([""]);
      }
    };
    fetchPrompts();
  }, []);

  const generateContent = async () => {
    setLoading(true);
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setSelectedPrompt(randomPrompt);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: randomPrompt }),
      });
      const data = await response.json();
      if (data.content) {
        setContent(data.content);
        const delayMinutes = 5;
        setTimeLeft(delayMinutes);
        const now = new Date();
        const shareTime = new Date(now.getTime() + delayMinutes * 60000);
        setShareTimeIST(shareTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
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

  const handleAddPrompt = async (newPrompt: string) => {
    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: newPrompt }),
      });
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error("Error adding prompt:", error);
    }
  };

  const handleEditPrompt = async (index: number, updatedPrompt: string) => {
    try {
      const response = await fetch("/api/prompts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, prompt: updatedPrompt }),
      });
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error("Error updating prompt:", error);
    }
  };

  const handleDeletePrompt = async (index: number) => {
    try {
      const response = await fetch("/api/prompts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error("Error deleting prompt:", error);
    }
  };

  const handleBulkAddPrompts = async (bulkPrompts: string) => {
    try {
      const newPrompts = bulkPrompts.split("\n").filter((p) => p.trim() !== "");
      for (const prompt of newPrompts) {
        await fetch("/api/prompts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
      }
      const response = await fetch("/api/prompts");
      const data = await response.json();
      setPrompts(data.prompts);
    } catch (error) {
      console.error("Error adding bulk prompts:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4">
      <h1 className="text-3xl font-bold mb-6 text-[#D8F3DC] text-center">LinkedIn AI Agent</h1>
      <div className="flex flex-row gap-6">
        <div className="w-1/2">
          <InputForm
            prompts={prompts}
            onGenerate={generateContent}
            onAddPrompt={handleAddPrompt}
            onEditPrompt={handleEditPrompt}
            onDeletePrompt={handleDeletePrompt}
            onBulkAddPrompts={handleBulkAddPrompts}
            loading={loading}
          />
        </div>
        <div className="w-1/2">
          {content && (
            <div>
              <h2 className="text-xl font-semibold text-[#D8F3DC] mb-2">Generated Content</h2>
              <p className="text-sm text-[#D8F3DC] mb-4">Prompt Used: {selectedPrompt}</p>
              <PostPreview content={content} />
              {timeLeft > 0 && (
                <p className="mt-4 text-sm text-[#D8F3DC]">
                  Time left to share: {timeLeft} min | Scheduled Share Time (IST): {shareTimeIST}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}