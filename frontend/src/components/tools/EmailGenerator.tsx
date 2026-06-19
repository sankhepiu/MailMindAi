"use client";

import { useState } from "react";
import { generateEmail, ToneType } from "@/lib/api";
import { Card, Button, Input, Textarea, Select, LoadingSpinner, ResultBox } from "@/components/ui";
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

export default function EmailGenerator() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [context, setContext] = useState("");
  const [tone, setTone] = useState<ToneType>("professional");
  const [senderName, setSenderName] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    // Basic validation before hitting the API
    if (purpose.trim().length < 5) {
      setError("Please describe the email purpose in a bit more detail.");
      return;
    }
    if (recipient.trim().length < 2) {
      setError("Please specify who the email is for.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await generateEmail({
        purpose,
        recipient,
        context: context || undefined,
        tone,
        sender_name: senderName || undefined,
      });
      setResult(response.result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating your email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Email Generator</h2>
      <p className="text-sm text-gray-500 mb-6">
        Describe what you need and we'll write the complete email for you.
      </p>

      <div className="space-y-4">
        <Textarea
          label="Purpose"
          hint="What is this email about?"
          placeholder="e.g. Request an internship opportunity at a software company"
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          rows={2}
        />

        <Input
          label="Recipient"
          placeholder="e.g. HR Manager at Google"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        <Textarea
          label="Additional context (optional)"
          placeholder="e.g. I'm a final-year CS student with React and Python experience"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Tone"
            options={TONE_OPTIONS}
            value={tone}
            onChange={(e) => setTone(e.target.value as ToneType)}
          />
          <Input
            label="Your name (optional)"
            placeholder="For the signature"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleGenerate} loading={loading} size="lg" className="w-full">
          {loading ? "Generating..." : "Generate Email"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Writing your email..." />}

      {result && !loading && (
        <div className="mt-6">
          <ResultBox
            result={result}
            label="Generated Email"
            onCopy={() => toast.success("Copied to clipboard!")}
          />
        </div>
      )}
    </Card>
  );
}