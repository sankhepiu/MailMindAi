/**
 * API Client — Typed functions for every backend endpoint.
 * 
 * All API calls go through this file.
 * Why? Single place to change the base URL, add auth headers, handle errors.
 */

import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 30000, // 30 second timeout for AI calls
});

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export type ToneType =
  | "professional"
  | "friendly"
  | "formal"
  | "casual"
  | "persuasive"
  | "confident"
  | "apologetic";

export type RewriteOption =
  | "improve_professionalism"
  | "make_concise"
  | "make_detailed"
  | "improve_grammar"
  | "improve_readability";

export type ReplyType = "positive" | "neutral" | "rejection" | "follow_up";

export interface EmailResponse {
  success: boolean;
  result: string;
  history_id?: number;
}

export interface SubjectLinesResponse {
  success: boolean;
  subject_lines: string[];
  history_id?: number;
}

export interface SummaryResponse {
  success: boolean;
  key_points: string[];
  action_items: string[];
  important_dates: string[];
  summary: string;
  history_id?: number;
}

export interface HistoryItem {
  id: number;
  action_type: string;
  input_text: string;
  parameters: string | null;
  output_text: string;
  created_at: string;
}

export interface HistoryResponse {
  success: boolean;
  items: HistoryItem[];
  total: number;
}

// ─── API Functions ────────────────────────────────────────────────────────────

export async function generateEmail(data: {
  purpose: string;
  recipient: string;
  context?: string;
  tone: ToneType;
  sender_name?: string;
}): Promise<EmailResponse> {
  const res = await api.post("/api/generate-email", data);
  return res.data;
}

export async function rewriteEmail(data: {
  original_email: string;
  rewrite_option: RewriteOption;
  additional_instructions?: string;
}): Promise<EmailResponse> {
  const res = await api.post("/api/rewrite-email", data);
  return res.data;
}

export async function changeTone(data: {
  original_email: string;
  target_tone: ToneType;
}): Promise<EmailResponse> {
  const res = await api.post("/api/change-tone", data);
  return res.data;
}

export async function generateSubjects(data: {
  email_context: string;
  count?: number;
}): Promise<SubjectLinesResponse> {
  const res = await api.post("/api/generate-subjects", data);
  return res.data;
}

export async function generateReply(data: {
  received_email: string;
  reply_type: ReplyType;
  additional_context?: string;
}): Promise<EmailResponse> {
  const res = await api.post("/api/generate-reply", data);
  return res.data;
}

export async function summarizeEmail(data: {
  email_thread: string;
}): Promise<SummaryResponse> {
  const res = await api.post("/api/summarize-email", data);
  return res.data;
}

export async function getHistory(params?: {
  search?: string;
  action_type?: string;
  limit?: number;
  offset?: number;
}): Promise<HistoryResponse> {
  const res = await api.get("/api/history", { params });
  return res.data;
}

export async function deleteHistoryItem(id: number): Promise<void> {
  await api.delete(`/api/history/${id}`);
}

export async function clearHistory(): Promise<void> {
  await api.delete("/api/history");
}