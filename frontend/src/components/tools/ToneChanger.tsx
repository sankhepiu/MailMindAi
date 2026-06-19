"use client";

import { useState } from "react";
import { changeTone, ToneType } from "@/lib/api";
import { Card, Button, Textarea, Select, LoadingSpinner, ResultBox } from "@/components/ui";
import toast from "react-hot-toast";

const TONE_OPTIONS: { value: ToneType; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "persuasive", label: "Persuasive" },
  { value: "confident", label: "Confident" },
  { value: "apologetic", label: "Apologetic" },
];

export default function ToneChanger() {
  const [originalEmail, setOriginalEmail] = useState("");
  const [targetTone, setTargetTone] = useState<ToneType>("friendly");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChangeTone = async () => {
    if (originalEmail.trim().length < 20) {
      setError("Please paste a longer email — at least 20 characters.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await changeTone({
        original_email: originalEmail,
        target_tone: targetTone,
      });
      setResult(response.result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong changing the tone. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Tone Changer</h2>
      <p className="text-sm text-gray-500 mb-6">
        Paste your email and pick the tone you want it to have instead.
      </p>

      <div className="space-y-4">
        <Textarea
          label="Original email"
          placeholder="Paste the email you want to change the tone of..."
          value={originalEmail}
          onChange={(e) => setOriginalEmail(e.target.value)}
          rows={8}
        />

        <Select
          label="Target tone"
          options={TONE_OPTIONS}
          value={targetTone}
          onChange={(e) => setTargetTone(e.target.value as ToneType)}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleChangeTone} loading={loading} size="lg" className="w-full">
          {loading ? "Changing tone..." : "Change Tone"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Adjusting the tone..." />}

      {result && !loading && (
        <div className="mt-6">
          <ResultBox
            result={result}
            label="Updated Email"
            onCopy={() => toast.success("Copied to clipboard!")}
          />
        </div>
      )}
    </Card>
  );
}