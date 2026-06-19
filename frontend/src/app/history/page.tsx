"use client";

import { useEffect, useState } from "react";
import { getHistory, deleteHistoryItem, clearHistory, HistoryItem } from "@/lib/api";
import { Card, Button, Input, LoadingSpinner, ActionBadge } from "@/components/ui";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadHistory = async (searchTerm?: string) => {
    setLoading(true);
    try {
      const response = await getHistory({ search: searchTerm || undefined, limit: 100 });
      setItems(response.items);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // Debounced search - waits 400ms after typing stops before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      loadHistory(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleDelete = async (id: number) => {
    try {
      await deleteHistoryItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item.");
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Clear your entire history? This cannot be undone.")) return;
    try {
      await clearHistory();
      setItems([]);
      toast.success("History cleared.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear history.");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">History</h1>
          <p className="text-gray-500 text-sm">
            Browse and search your previous AI generations.
          </p>
        </div>
        {items.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClearAll}>
            Clear all
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search your history..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <LoadingSpinner message="Loading history..." />}

      {!loading && items.length === 0 && (
        <Card className="p-10 text-center">
          <p className="text-gray-400 text-sm">
            {search ? "No results found for that search." : "No history yet — generate something on the Dashboard to see it here."}
          </p>
        </Card>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <Card key={item.id} className="p-4">
                <div
                  className="flex items-start justify-between gap-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ActionBadge type={item.action_type} />
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">{item.input_text}</p>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    <div className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">Output</p>
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                        {item.output_text}
                      </pre>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => handleCopy(item.output_text)}>
                        Copy result
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}