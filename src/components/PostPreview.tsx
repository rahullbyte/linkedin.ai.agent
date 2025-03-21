import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function PostPreview({ content }: { content: string }) {
  const handlePost = async () => {
    await fetch("/api/linkedin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  };

  return (
    <Card className="mt-6 p-4 border rounded-lg shadow ">
      <CardContent className="max-h-60 overflow-y-auto p-2 ">
        <p className="text-lg font-medium mb-4 text-[#081C15]">{content}</p>
      </CardContent>
      <div className="p-2">
        <Button onClick={handlePost} className="bg-[#52B788] hover:bg-[#74C69D] w-full">
          Post to LinkedIn
        </Button>
      </div>
    </Card>
  );
}

export default PostPreview