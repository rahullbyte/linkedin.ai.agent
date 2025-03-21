import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

function InputForm({ onGenerate, setPrompt, loading }: { onGenerate: () => void; setPrompt: (prompt: string) => void; loading: boolean }) {
  return (
    <Card className="p-4 border rounded-lg drop-shadow-lg">
      <CardContent>
        <Input
          type="text"
          onChange={(e) => setPrompt(e.target.value)}
          className="mb-4"
          placeholder="Enter content prompt"
        />
        <Button onClick={onGenerate} disabled={loading} className="bg-[#52B788] hover:bg-[#74C69D] text-[#D8F3DC] w-full">
          {loading ? <Loader2 className="animate-spin" /> : "Generate"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default InputForm