"use client";

import { useState } from "react";
import { generateSubjects } from "@/lib/api";
import { Card, Button, Textarea, LoadingSpinner } from "@/components/ui";
import toast from "react-hot-toast";

export default function SubjectGenerator() {
  const [emailContext, setEmailContext] = useState("");
  const [count, setCount] = useState(6);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (emailContext.trim().length < 10) {
      setError("Please describe the email context in more detail.");
      return;
    }

    setError(null);
    setLoading(true);
    setResults(null);

    try {
      const response = await generateSubjects({
        email_context: emailContext,
        count,
      });
      setResults(response.subject_lines);
    } catch (err) {
      console.error(err);
      setError("Something went wrong generating subject lines. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Subject line copied!");
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Subject Line Generator</h2>
      <p className="text-sm text-gray-500 mb-6">
        Describe the email and get multiple subject line options to choose from.
      </p>

      <div className="space-y-4">
        <Textarea
          label="Email context"
          placeholder="e.g. Requesting a software engineering internship at a tech company"
          value={emailContext}
          onChange={(e) => setEmailContext(e.target.value)}
          rows={3}
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">
            Number of suggestions: {count}
          </label>
          <input
            type="range"
            min={3}
            max={10}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-indigo-600"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleGenerate} loading={loading} size="lg" className="w-full">
          {loading ? "Generating..." : "Generate Subject Lines"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Brainstorming subject lines..." />}

      {results && !loading && (
        <div className="mt-6 space-y-2">
          <span className="text-sm font-medium text-gray-700">
            {results.length} Subject Line Options
          </span>
          {results.map((subject, i) => (
            <div
              key={i}
              onClick={() => handleCopy(subject)}
              className="group flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl px-4 py-3 cursor-pointer transition-colors"
            >
              <span className="text-sm text-gray-800">{subject}</span>
              <svg
                className="h-4 w-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}