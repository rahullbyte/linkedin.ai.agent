import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useState } from "react";

function PostPreview({ content }: { content: string }) {
  const [isPosted, setIsPosted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      
      if (response.ok) {
        setIsPosted(true);
      } else {
        console.error("Failed to post to LinkedIn");
      }
    } catch (error) {
      console.error("Posting error:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <Card className="mt-6 p-4 border rounded-lg shadow">
      <CardContent className="max-h-60 overflow-y-auto p-2">
        <p className="text-lg font-medium mb-4 text-[#081C15]">{content}</p>
      </CardContent>
      <div className="p-2">
        <Button
          onClick={handlePost}
          disabled={isPosted || isLoading} 
          className={`w-full flex items-center justify-center gap-2 ${
            isPosted
              ? "bg-gray-400 cursor-not-allowed"
              : isLoading
              ? "bg-[#52B788] opacity-75 cursor-not-allowed"
              : "bg-[#52B788] hover:bg-[#74C69D]"
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : isPosted ? (
            <>
              <Check className="w-4 h-4" />
              Posted
            </>
          ) : (
            "Post to LinkedIn"
          )}
        </Button>
      </div>
    </Card>
  );
}

export default PostPreview;