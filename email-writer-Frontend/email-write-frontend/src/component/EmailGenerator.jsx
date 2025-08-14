import React, { useState } from "react";
import "./EmailGenerator.css";

export default function EmailGenerator() {
  const [inputText, setInputText] = useState("");
  const [tone, setTone] = useState("friendly");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);
    setReply("");

    try {
      const response = await fetch("http://localhost:8080/api/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailContent: inputText, tone }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate reply");
      }

      const textReply = await response.text();
      setReply(textReply);
    } catch (error) {
      console.error(error);
      setReply("Error generating reply");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (reply) {
      navigator.clipboard.writeText(reply);
      alert("Copied to clipboard!");
    }
  };

  return (
    <div className="page-container">
      <div className="email-generator-container">
        <h1 className="title">Email Reply Generator</h1>

        {/* Input */}
        <textarea
          className="input-area"
          placeholder="Enter the email content..."
          rows="5"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />

        {/* Tone selector */}
        <select
          className="tone-select"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="professional">Professional</option>
          <option value="friendly">Friendly</option>
          <option value="casual">Casual</option>
          <option value="neutral">Neutral</option>
        </select>

        {/* Generate button */}
        <button
          className="generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Reply"}
        </button>

        {/* Reply output */}
        {reply && (
          <div className="reply-box">
            <h2 className="reply-title">Generated Reply:</h2>
            <p className="reply-text">{reply}</p>
          </div>
        )}

        {/* Copy button */}
        {reply && (
          <button className="copy-btn" onClick={handleCopy}>
            Copy Reply
          </button>
        )}
      </div>
    </div>
  );
}
