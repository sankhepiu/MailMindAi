"use client";

import { useState } from "react";
import { rewriteEmail, RewriteOption } from "@/lib/api";
import { Card, Button, Textarea, Select, LoadingSpinner, ResultBox } from "@/components/ui";
import toast from "react-hot-toast";

const REWRITE_OPTIONS: { value: RewriteOption; label: string }[] = [
  { value: "improve_professionalism", label: "Improve professionalism" },
  { value: "make_concise", label: "Make concise" },
  { value: "make_detailed", label: "Make more detailed" },
  { value: "improve_grammar", label: "Fix grammar" },
  { value: "improve_readability", label: "Improve readability" },
];

export default function EmailRewriter() {
  const [originalEmail, setOriginalEmail] = useState("");
  const [rewriteOption, setRewriteOption] = useState<RewriteOption>("improve_professionalism");
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (originalEmail.trim().length < 20) {
      setError("Please paste a longer email — at least 20 characters.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await rewriteEmail({
        original_email: originalEmail,
        rewrite_option: rewriteOption,
        additional_instructions: additionalInstructions || undefined,
      });
      setResult(response.result);
    } catch (err) {
      console.error(err);
      setError("Something went wrong rewriting your email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Email Rewriter</h2>
      <p className="text-sm text-gray-500 mb-6">
        Paste your email and choose how you'd like it improved.
      </p>

      <div className="space-y-4">
        <Textarea
          label="Original email"
          placeholder="Paste the email you want to rewrite..."
          value={originalEmail}
          onChange={(e) => setOriginalEmail(e.target.value)}
          rows={8}
        />

        <Select
          label="Rewrite goal"
          options={REWRITE_OPTIONS}
          value={rewriteOption}
          onChange={(e) => setRewriteOption(e.target.value as RewriteOption)}
        />

        <Textarea
          label="Additional instructions (optional)"
          placeholder="e.g. Keep it under 100 words"
          value={additionalInstructions}
          onChange={(e) => setAdditionalInstructions(e.target.value)}
          rows={2}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleRewrite} loading={loading} size="lg" className="w-full">
          {loading ? "Rewriting..." : "Rewrite Email"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Improving your email..." />}

      {result && !loading && (
        <div className="mt-6">
          <ResultBox
            result={result}
            label="Rewritten Email"
            onCopy={() => toast.success("Copied to clipboard!")}
          />
        </div>
      )}
    </Card>
  );
}