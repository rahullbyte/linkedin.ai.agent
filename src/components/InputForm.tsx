import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface InputFormProps {
  prompts: string[];
  onGenerate: () => void;
  onAddPrompt: (prompt: string) => void;
  onEditPrompt: (index: number, prompt: string) => void;
  onDeletePrompt: (index: number) => void;
  onBulkAddPrompts: (prompts: string) => void;
  loading: boolean;
}

function InputForm({
  prompts,
  onGenerate,
  onAddPrompt,
  onEditPrompt,
  onDeletePrompt,
  onBulkAddPrompts,
  loading,
}: InputFormProps) {
  const [promptInput, setPromptInput] = useState("");

  const handleAddPrompts = () => {
    if (promptInput.trim()) {
      const lines = promptInput.split("\n").filter((line) => line.trim() !== "");
      if (lines.length === 1) {
        onAddPrompt(lines[0]); // Single prompt
      } else {
        onBulkAddPrompts(promptInput); // Bulk prompts
      }
      setPromptInput(""); // Clear input after adding
    }
  };

  return (
    <Card className="p-4 border rounded-lg drop-shadow-lg">
      <CardContent className="flex flex-col h-full">
        <textarea
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Add a prompt or multiple prompts (one per line)"
          className="w-full p-2 mb-2 border rounded h-24 resize-none"
        />
        <Button
          onClick={handleAddPrompts}
          className="w-full bg-[#52B788] hover:bg-[#74C69D] text-[#D8F3DC] mb-4"
        >
          Add Prompt
        </Button>

        <div className="max-h-40 overflow-y-auto mb-4">
          {prompts.map((prompt, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                type="text"
                value={prompt}
                onChange={(e) => onEditPrompt(index, e.target.value)}
                className="flex-1 mr-2"
              />
              <Button
                onClick={() => onDeletePrompt(index)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        <Button
          onClick={onGenerate}
          disabled={loading}
          className="bg-[#52B788] hover:bg-[#74C69D] text-[#D8F3DC] w-full mt-auto"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Generate Random Content"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default InputForm;