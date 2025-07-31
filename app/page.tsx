"use client";

import { useEffect, useState } from "react";
import { evaluate } from "mathjs";

export default function Calculator() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [memory, setMemory] = useState<number>(0);

  const handleClick = (value: string) => {
    if (value === "C") {
      setInput("");
      return;
    }

    if (value === "=") {
      try {
        const result = evaluate(input).toString();
        setInput(result);
        setHistory((prev) => [`${input} = ${result}`, ...prev]);
      } catch {
        setInput("Error");
      }
      return;
    }

    if (value === "√") {
      try {
        const result = Math.sqrt(evaluate(input)).toString();
        setInput(result);
        setHistory((prev) => [`√(${input}) = ${result}`, ...prev]);
      } catch {
        setInput("Error");
      }
      return;
    }

    if (value === "%") {
      try {
        const result = (evaluate(input) / 100).toString();
        setInput(result);
        setHistory((prev) => [`${input}% = ${result}`, ...prev]);
      } catch {
        setInput("Error");
      }
      return;
    }

    if (["M+", "MR", "MC"].includes(value)) {
      handleMemory(value);
      return;
    }

    setInput((prev) => prev + value);
  };

  const handleMemory = (type: string) => {
    const current = parseFloat(input);
    if (isNaN(current)) return;

    if (type === "M+") setMemory((prev) => prev + current);
    if (type === "MR") setInput(memory.toString());
    if (type === "MC") setMemory(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if ("0123456789+-*/.".includes(key)) handleClick(key);
      else if (key === "Enter") handleClick("=");
      else if (key === "Backspace") setInput((prev) => prev.slice(0, -1));
      else if (key === "Escape") handleClick("C");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input]);

  const buttons = [
    "MC",
    "MR",
    "M+",
    "C",
    "√",
    "%",
    "/",
    "*",
    "7",
    "8",
    "9",
    "-",
    "4",
    "5",
    "6",
    "+",
    "1",
    "2",
    "3",
    "=",
    "0",
    ".",
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calculator UI */}
        <div>
          <div className="bg-gray-200 text-right text-3xl px-4 py-3 rounded mb-4 min-h-[60px]">
            {input || "0"}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleClick(btn)}
                className="bg-blue-500 text-white text-xl font-semibold py-3 rounded hover:bg-blue-600 transition"
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <h2 className="text-xl font-bold mb-2">History</h2>
          {history.length === 0 ? (
            <p className="text-gray-500">No calculations yet.</p>
          ) : (
            <ul className="max-h-80 overflow-y-auto border rounded p-3 text-sm bg-gray-50">
              {history.map((item, i) => (
                <li key={i} className="border-b last:border-none py-1">
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
