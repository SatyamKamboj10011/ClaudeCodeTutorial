"use client";

import { Loader2, FilePlus, FilePen, FileSearch, Trash2, ArrowRightLeft, FileText } from "lucide-react";

interface StrReplaceArgs {
  command: "view" | "create" | "str_replace" | "insert" | "undo_edit";
  path: string;
  [key: string]: unknown;
}

interface FileManagerArgs {
  command: "rename" | "delete";
  path: string;
  new_path?: string;
  [key: string]: unknown;
}

type ToolArgs = StrReplaceArgs | FileManagerArgs;

interface ToolCallBadgeProps {
  toolName: string;
  args: ToolArgs;
  isDone: boolean;
}

function getFileName(path: string | undefined): string {
  if (!path) return "";
  return path.split("/").filter(Boolean).pop() ?? path;
}

function getLabel(toolName: string, args: ToolArgs): { icon: React.ReactNode; text: string } {
  if (toolName === "str_replace_editor") {
    const { command, path } = args as StrReplaceArgs;
    if (!command || !path) return { icon: <FileText className="w-3 h-3" />, text: toolName };
    const file = getFileName(path);
    switch (command) {
      case "create":
        return { icon: <FilePlus className="w-3 h-3" />, text: `Creating ${file}` };
      case "str_replace":
      case "insert":
        return { icon: <FilePen className="w-3 h-3" />, text: `Editing ${file}` };
      case "view":
        return { icon: <FileSearch className="w-3 h-3" />, text: `Reading ${file}` };
      case "undo_edit":
        return { icon: <FilePen className="w-3 h-3" />, text: `Undoing edit in ${file}` };
    }
  }

  if (toolName === "file_manager") {
    const { command, path, new_path } = args as FileManagerArgs;
    if (!command || !path) return { icon: <FileText className="w-3 h-3" />, text: toolName };
    const file = getFileName(path);
    switch (command) {
      case "delete":
        return { icon: <Trash2 className="w-3 h-3" />, text: `Deleting ${file}` };
      case "rename":
        const newFile = new_path ? getFileName(new_path) : "";
        return { icon: <ArrowRightLeft className="w-3 h-3" />, text: `Renaming ${file} to ${newFile}` };
    }
  }

  return { icon: <FileText className="w-3 h-3" />, text: toolName };
}

export function ToolCallBadge({ toolName, args, isDone }: ToolCallBadgeProps) {
  const { icon, text } = getLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600 flex-shrink-0" />
      )}
      <span className="text-neutral-600">{icon}</span>
      <span className="text-neutral-700">{text}</span>
    </div>
  );
}
