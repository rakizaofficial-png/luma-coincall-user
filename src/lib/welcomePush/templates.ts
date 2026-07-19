/**
 * Large notification / lure message template pool.
 * Each entry has a stable id so rotation can avoid recent repeats.
 */

export type MessageTemplate = {
  id: string;
  text: string;
};

export const NOTIFICATION_TEMPLATES: MessageTemplate[] = [
  { id: "m01", text: "Hi, I'm online now." },
  { id: "m02", text: "I'm available for a private call." },
  { id: "m03", text: "I'd love to chat with you." },
  { id: "m04", text: "I'm waiting for you." },
  { id: "m05", text: "Let's talk for a few minutes." },
  { id: "m06", text: "Free for a quick video call?" },
  { id: "m07", text: "Just came online — want to talk?" },
  { id: "m08", text: "I saw you were active. Call me?" },
  { id: "m09", text: "Feeling chatty tonight…" },
  { id: "m10", text: "Private line open — answer me?" },
  { id: "m11", text: "Missed our last chat. Free now?" },
  { id: "m12", text: "Got a few minutes just for you." },
  { id: "m13", text: "Hey stranger — shall we connect?" },
  { id: "m14", text: "I'm free right now. Ring me." },
  { id: "m15", text: "Want a cozy one-to-one?" },
  { id: "m16", text: "Online and waiting for someone nice." },
  { id: "m17", text: "Can we talk for a bit?" },
  { id: "m18", text: "I saved a spot for you." },
  { id: "m19", text: "Video chat? I'm ready." },
  { id: "m20", text: "Come say hi — I'm live." },
  { id: "m21", text: "Soft mood tonight. Join me?" },
  { id: "m22", text: "Only answering a few calls…" },
  { id: "m23", text: "You seem interesting. Call?" },
  { id: "m24", text: "Quick hello? I'm online." },
  { id: "m25", text: "Private room is open." },
  { id: "m26", text: "Let's break the ice on video." },
  { id: "m27", text: "I've got time — pick up?" },
  { id: "m28", text: "Waiting on the line for you." },
  { id: "m29", text: "New night, new chat. Join?" },
  { id: "m30", text: "Answer if you want to talk." },
  { id: "m31", text: "I'm in a good mood — call me." },
  { id: "m32", text: "One-to-one? I'm free now." },
  { id: "m33", text: "Don't keep me waiting too long." },
  { id: "m34", text: "Tap accept — I'm already here." },
  { id: "m35", text: "Looking for a real conversation." },
  { id: "m36", text: "Hi again — free for a call?" },
  { id: "m37", text: "Your turn to answer." },
  { id: "m38", text: "I picked you. Want to talk?" },
  { id: "m39", text: "Short call, big vibe — ready?" },
  { id: "m40", text: "Online now. Don't miss me." },
];

export const DURATION_PREVIEWS = [
  "about 2 min",
  "2–3 min",
  "a few minutes",
  "quick 3 min",
  "5 min chat",
  "short & sweet",
  "just a moment",
  "~4 min",
] as const;

export const STATUS_LINES = [
  "Ringing…",
  "Calling you…",
  "Waiting for answer…",
  "Incoming private video…",
  "Secure line ringing…",
] as const;

export const CONNECT_LINES = [
  "Connected · crystal clear",
  "Private · HD video",
  "Live · encrypted",
  "Connected · low latency",
  "You're live together",
] as const;
