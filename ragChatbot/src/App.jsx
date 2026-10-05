import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const App = () => {
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState([]);
  const [answer, setAnswer] = useState("");
  const [displayedAnswer, setDisplayedAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const chatWindowRef = useRef(null);

  // Typing effect for the bot's answer
  useEffect(() => {
    if (!answer) return;
    let index = 0;
    setDisplayedAnswer("");
    const interval = setInterval(() => {
      setDisplayedAnswer(answer.slice(0, index + 1));
      index++;
      if (index >= answer.length) {
        clearInterval(interval);
        setMessage((prev) => [...prev, { from: "bot", text: answer }]);
        setAnswer("");
        setDisplayedAnswer("");
      }
    }, 30);
    return () => clearInterval(interval);
  }, [answer]);

  // Auto-scroll to the bottom
  useEffect(() => {
    chatWindowRef.current?.scrollTo({
      top: chatWindowRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [message, displayedAnswer]);

  const handleAsk = async () => {
    if (!query.trim() || loading) return;

    const userQuery = query;
    setMessage((prev) => [...prev, { from: "user", text: userQuery }]);
    setQuery("");
    setLoading(true);
    setAnswer("");
    setDisplayedAnswer("");

    try {
      const res = await axios.post("https://bookish-garbanzo-q77pvvvp9j6jc9wg4-3000.app.github.dev/ask", {
        query: userQuery,
      });
      setAnswer(res.data.answer || "No answer returned.");
    } catch (error) {
      console.error(error);
      setAnswer("Error fetching answer. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#FFFDF8] rounded-2xl shadow-md overflow-hidden border border-[#E7E2D8]">
        <div className="bg-[#7A8B72] text-white p-4 text-lg font-semibold">
          RAG Chatbot
        </div>

        <div
          className="h-96 p-4 overflow-y-auto space-y-3 bg-black"
          ref={chatWindowRef}
        >
          {message.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                  msg.from === "user"
                    ? "bg-[#DDE5D8] text-[#3F493B] rounded-2xl rounded-br-sm"
                    : "bg-[#EEEAE1] text-[#4B4A43] rounded-2xl rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {displayedAnswer && (
            <div className="flex justify-start">
              <div className="bg-[#EEEAE1] text-[#4B4A43] px-4 py-2 rounded-2xl rounded-bl-sm max-w-[80%] whitespace-pre-wrap">
                {displayedAnswer}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 p-4 border-t border-[#E7E2D8] bg-[#FFFDF8]">
          <input
            type="text"
            placeholder="Ask something..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            className="flex-1 bg-[#F5F3EE] border border-[#DDD8CC] rounded-lg px-4 py-2 outline-none text-[#4B4A43] focus:ring-2 focus:ring-[#A7B39F]"
          />

          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-[#7A8B72] text-white px-5 py-2 rounded-lg hover:bg-[#687960] disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;