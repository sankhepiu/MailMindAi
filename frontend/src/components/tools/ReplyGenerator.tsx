"use client";

import { useState } from "react";
import { generateReply, ReplyType } from "@/lib/api";
import { Card, Button, Textarea, Select, LoadingSpinner, ResultBox } from "@/components/ui";
import toast from "react-hot-toast";

const REPLY_OPTIONS: { value: ReplyType; label: string }[] = [
  { value: "positive", label: "Positive / Accept" },
  { value: "neutral", label: "Neutral / Acknowledge" },
  { value: "rejection", label: "Rejection / Decline" },
  { value: "follow_up", label: "Follow-up" },
];

export default function ReplyGenerator() {
  const [receivedEmail, setReceivedEmail] = useState("");
  const [replyType, setReplyType] = useState<ReplyType>("positive");
  const [additionalContext, setAdditionalContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (receivedEmail.trim().length < 20) {
      setError("Please paste a longer email — at least 20 characters.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await generateReply({
        received_email: receivedEmail,
        reply_type: replyType,
        additional_context: additionalContext || undefined,
      });
      setResult(response.result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating the reply. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">AI Reply Generator</h2>
      <p className="text-sm text-gray-500 mb-6">
        Paste the email you received and pick the type of reply you want.
      </p>

      <div className="space-y-4">
        <Textarea
          label="Received email"
          placeholder="Paste the email you want to reply to..."
          value={receivedEmail}
          onChange={(e) => setReceivedEmail(e.target.value)}
          rows={8}
        />

        <Select
          label="Reply type"
          options={REPLY_OPTIONS}
          value={replyType}
          onChange={(e) => setReplyType(e.target.value as ReplyType)}
        />

        <Textarea
          label="Additional context (optional)"
          placeholder="e.g. Mention that I'll need to confirm availability by Friday"
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          rows={2}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleGenerate} loading={loading} size="lg" className="w-full">
          {loading ? "Generating..." : "Generate Reply"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Drafting your reply..." />}

      {result && !loading && (
        <div className="mt-6">
          <ResultBox
            result={result}
            label="Generated Reply"
            onCopy={() => toast.success("Copied to clipboard!")}
          />
        </div>
      )}
    </Card>
  );
}