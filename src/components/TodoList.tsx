"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface TodoItem {
  id: number
  text: string
}

export function TodoList() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Buy groceries" },
    { id: 2, text: "Walk the dog" },
  ])
  const [inputValue, setInputValue] = useState("")

  const addTodo = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    setTodos((prev) => [...prev, { id: Date.now(), text: trimmed }])
    setInputValue("")
  }

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Todo List</h1>

        {/* Input area */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addTodo}
            disabled={!inputValue.trim()}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
              inputValue.trim()
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-blue-300 cursor-not-allowed"
            )}
          >
            Add
          </button>
        </div>

        {/* Todo items */}
        {todos.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">
            No tasks yet. Add one above!
          </p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 group"
              >
                <span className="text-sm text-gray-700 break-all">{todo.text}</span>
                <button
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`Remove "${todo.text}"`}
                  className="ml-3 flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Footer count */}
        {todos.length > 0 && (
          <p className="mt-4 text-xs text-gray-400 text-right">
            {todos.length} {todos.length === 1 ? "task" : "tasks"}
          </p>
        )}
      </div>
    </div>
  )
}
