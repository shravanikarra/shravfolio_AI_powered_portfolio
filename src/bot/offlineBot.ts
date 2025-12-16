import { faqIntents, FAQIntent } from "./faq";

export type OfflineChatMessage = { role: "user" | "assistant"; content: string };

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const scoreIntent = (input: string, intent: FAQIntent): number => {
  let score = 0;
  intent.keywords.forEach(keyword => {
    if (input.includes(keyword)) {
      score += 2;
    } else {
      const parts = keyword.split(" ");
      parts.forEach(p => {
        if (p && input.includes(p)) score += 1;
      });
    }
  });
  return score;
};

export function getOfflineReply(userText: string, history: OfflineChatMessage[]) {
  const normalized = normalize(userText);
  let best: { intent: FAQIntent | null; score: number } = { intent: null, score: 0 };

  faqIntents.forEach(intent => {
    const score = scoreIntent(normalized, intent);
    if (score > best.score) {
      best = { intent, score };
    }
  });

  if (best.intent && best.score > 1) {
    const reply = best.intent.response;
    return { reply, matchedIntent: best.intent.id };
  }

  const suggestions =
    "Try asking: \"Tell me about Immigame\", \"Show ML projects\", \"How do I contact you?\", or \"What models have you used?\"";
  return {
    reply: "I may not have that on hand, but I can help with systems, ML methods, skills, or navigation. " + suggestions,
    matchedIntent: "fallback"
  };
}
