"use client";

import { useState } from "react";
import EmailGenerator from "@/components/tools/EmailGenerator";
import EmailRewriter from "@/components/tools/EmailRewriter";
import ToneChanger from "@/components/tools/ToneChanger";
import SubjectGenerator from "@/components/tools/SubjectGenerator";
import ReplyGenerator from "@/components/tools/ReplyGenerator";
import Summarizer from "@/components/tools/Summarizer";
import { clsx } from "clsx";

const TOOLS = [
  { id: "generate", label: "Email Generator" },
  { id: "rewrite", label: "Email Rewriter" },
  { id: "tone", label: "Tone Changer" },
  { id: "subject", label: "Subject Lines" },
  { id: "reply", label: "Reply Generator" },
  { id: "summarize", label: "Summarizer" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

export default function DashboardPage() {
  const [activeTool, setActiveTool] = useState<ToolId>("generate");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          Choose a tool below to generate, rewrite, or analyze your emails.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              activeTool === tool.id
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Active Tool Panel */}
      <div className="animate-fade-in">
        {activeTool === "generate" && <EmailGenerator />}
        {activeTool === "rewrite" && <EmailRewriter />}
        {activeTool === "tone" && <ToneChanger />}
        {activeTool === "subject" && <SubjectGenerator />}
        {activeTool === "reply" && <ReplyGenerator />}
        {activeTool === "summarize" && <Summarizer />}
      </div>
    </div>
  );
}