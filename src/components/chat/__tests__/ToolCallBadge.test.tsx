import { render, screen, cleanup } from "@testing-library/react";
import { describe, test, expect, afterEach } from "vitest";
import { ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

describe("ToolCallBadge", () => {
  describe("str_replace_editor", () => {
    test("shows 'Creating' for create command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Creating App.jsx")).toBeDefined();
    });

    test("shows 'Editing' for str_replace command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "str_replace", path: "/components/Card.jsx" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Editing Card.jsx")).toBeDefined();
    });

    test("shows 'Editing' for insert command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "insert", path: "/utils/helpers.ts" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Editing helpers.ts")).toBeDefined();
    });

    test("shows 'Reading' for view command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "view", path: "/index.ts" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Reading index.ts")).toBeDefined();
    });

    test("shows 'Undoing edit' for undo_edit command", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "undo_edit", path: "/App.jsx" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Undoing edit in App.jsx")).toBeDefined();
    });
  });

  describe("file_manager", () => {
    test("shows 'Deleting' for delete command", () => {
      render(
        <ToolCallBadge
          toolName="file_manager"
          args={{ command: "delete", path: "/old-file.jsx" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Deleting old-file.jsx")).toBeDefined();
    });

    test("shows 'Renaming' for rename command", () => {
      render(
        <ToolCallBadge
          toolName="file_manager"
          args={{ command: "rename", path: "/Button.jsx", new_path: "/components/Button.jsx" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Renaming Button.jsx to Button.jsx")).toBeDefined();
    });
  });

  describe("unknown tool", () => {
    test("falls back to tool name for unknown tools", () => {
      render(
        <ToolCallBadge
          toolName="some_unknown_tool"
          args={{ command: "create", path: "/foo.ts" } as any}
          isDone={false}
        />
      );
      expect(screen.getByText("some_unknown_tool")).toBeDefined();
    });
  });

  describe("isDone state", () => {
    test("shows spinner when not done", () => {
      const { container } = render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          isDone={false}
        />
      );
      expect(container.querySelector(".animate-spin")).not.toBe(null);
    });

    test("shows green dot and no spinner when done", () => {
      const { container } = render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/App.jsx" }}
          isDone={true}
        />
      );
      expect(container.querySelector(".bg-emerald-500")).not.toBe(null);
      expect(container.querySelector(".animate-spin")).toBe(null);
    });
  });

  describe("file name extraction", () => {
    test("extracts filename from nested path", () => {
      render(
        <ToolCallBadge
          toolName="str_replace_editor"
          args={{ command: "create", path: "/src/components/ui/Button.tsx" }}
          isDone={false}
        />
      );
      expect(screen.getByText("Creating Button.tsx")).toBeDefined();
    });
  });
});
