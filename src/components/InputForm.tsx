interface InputFormProps {
  onGenerate: () => void;
  setPrompt: (prompt: string) => void;
}

export default function InputForm({ onGenerate, setPrompt }: InputFormProps) {
  return (
    <div className="mb-6">
      <input
        type="text"
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 w-full mb-2"
        placeholder="Enter content prompt"
      />
      <button
        onClick={onGenerate}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Generate
      </button>
    </div>
  );
}