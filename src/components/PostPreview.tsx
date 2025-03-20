interface PostPreviewProps {
  content: string; // Changed from imageUrl to content
}

export default function PostPreview({ content }: PostPreviewProps) {
  const handlePost = async () => {
    await fetch("/api/linkedin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }), // Send content instead of imageUrl
    });
  };

  return (
    <div className="mt-6 p-4 border rounded">
      <h1 className="mt-2 max-w-full h-auto">{content}</h1>
      <button
        onClick={handlePost}
        className="mt-2 bg-green-500 text-white p-2 rounded"
      >
        Post to LinkedIn
      </button>
    </div>
  );
}