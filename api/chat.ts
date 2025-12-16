import { GoogleGenAI } from "@google/genai";

type ChatHistoryItem = { role: "user" | "assistant"; content: string };

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured: missing API key" });
    return;
  }

  let body: any = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      res.status(400).json({ error: "Invalid JSON payload" });
      return;
    }
  }

  const message: string | undefined = body?.message;
  const history: ChatHistoryItem[] = Array.isArray(body?.history) ? body.history : [];

  if (!message || typeof message !== "string") {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  try {
    const client = new GoogleGenAI({ apiKey });

    const contents = [
      ...history.map(item => ({
        role: item.role === "assistant" ? "model" : "user",
        parts: [{ text: item.content }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const result = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents
    });

    const reply =
      (result as any)?.response?.text?.() ||
      (result as any)?.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      (result as any)?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    if (!reply) {
      res.status(502).json({ error: "No response from model" });
      return;
    }

    res.status(200).json({ reply });
  } catch (error: any) {
    console.error("Chat API error", error?.message || error);
    res.status(500).json({ error: "Sorry — something went wrong. Try again." });
  }
}
