"use client";

import { useState } from "react";
import { summarizeEmail, SummaryResponse } from "@/lib/api";
import { Card, Button, Textarea, LoadingSpinner } from "@/components/ui";

export default function Summarizer() {
  const [emailThread, setEmailThread] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (emailThread.trim().length < 50) {
      setError("Please paste a longer email thread — at least 50 characters.");
      return;
    }

    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await summarizeEmail({ email_thread: emailThread });
      setResult(response);
    } catch (err) {
      console.error(err);
      setError("Something went wrong summarizing the thread. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">Thread Summarizer</h2>
      <p className="text-sm text-gray-500 mb-6">
        Paste a long email thread to extract key points, action items, and dates.
      </p>

      <div className="space-y-4">
        <Textarea
          label="Email thread"
          placeholder="Paste the full email thread here..."
          value={emailThread}
          onChange={(e) => setEmailThread(e.target.value)}
          rows={10}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handleSummarize} loading={loading} size="lg" className="w-full">
          {loading ? "Summarizing..." : "Summarize Thread"}
        </Button>
      </div>

      {loading && <LoadingSpinner message="Reading through the thread..." />}

      {result && !loading && (
        <div className="mt-6 space-y-5 animate-fade-in">
          {/* Overall Summary */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-indigo-900 mb-1.5">Summary</h3>
            <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
          </div>

          {/* Key Points */}
          {result.key_points.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Key Points
              </h3>
              <ul className="space-y-1.5">
                {result.key_points.map((point, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Items */}
          {result.action_items.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Action Items
              </h3>
              <ul className="space-y-1.5">
                {result.action_items.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2 items-start">
                    <input type="checkbox" className="mt-1 accent-indigo-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Important Dates */}
          {result.important_dates.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Important Dates
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.important_dates.map((date, i) => (
                  <span
                    key={i}
                    className="bg-amber-50 text-amber-700 border border-amber-100 rounded-lg px-3 py-1.5 text-sm"
                  >
                    {date}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}