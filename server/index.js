import "dotenv/config";
import express from "express";
import nodemailer from "nodemailer";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = Number(process.env.PORT) || 3001;
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const distPath = path.join(projectRoot, "dist");
const contactWindows = new Map();
const rateLimitWindowMs = 15 * 60 * 1000;
const maxMessagesPerWindow = 4;
const rateLimitCleanup = setInterval(() => {
  const now = Date.now();
  for (const [ip, window] of contactWindows) {
    if (now - window.startedAt >= rateLimitWindowMs) contactWindows.delete(ip);
  }
}, rateLimitWindowMs);
rateLimitCleanup.unref();

app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/contact", async (request, response) => {
  const { name, email, message, website } = request.body ?? {};

  if (typeof website === "string" && website.trim()) {
    return response.status(400).json({ error: "Invalid form submission." });
  }

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string"
  ) {
    return response.status(400).json({ error: "Please complete all fields." });
  }

  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanMessage = message.trim();
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail);

  if (
    cleanName.length < 2 ||
    cleanName.length > 80 ||
    cleanEmail.length > 254 ||
    !validEmail ||
    cleanMessage.length < 10 ||
    cleanMessage.length > 3000
  ) {
    return response.status(400).json({ error: "Please check your details and try again." });
  }

  const now = Date.now();
  const clientIp = request.ip ?? request.socket.remoteAddress ?? "unknown";
  const previousWindow = contactWindows.get(clientIp);
  const window = previousWindow && now - previousWindow.startedAt < rateLimitWindowMs
    ? previousWindow
    : { startedAt: now, count: 0 };

  if (window.count >= maxMessagesPerWindow) {
    const retryAfter = Math.ceil((rateLimitWindowMs - (now - window.startedAt)) / 1000);
    response.set("Retry-After", String(retryAfter));
    return response.status(429).json({ error: "Too many messages. Please try again a little later." });
  }

  window.count += 1;
  contactWindows.set(clientIp, window);

  const { SMTP_URL, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_URL || !CONTACT_TO || !CONTACT_FROM) {
    return response.status(503).json({
      error: "The contact service is not configured yet. Please use the email link instead.",
    });
  }

  try {
    const transporter = nodemailer.createTransport(SMTP_URL);
    await transporter.sendMail({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: { name: cleanName, address: cleanEmail },
      subject: "New portfolio inquiry",
      text: `Name: ${cleanName}\nEmail: ${cleanEmail}\n\n${cleanMessage}`,
    });
    return response.status(202).json({ status: "sent" });
  } catch (error) {
    console.error("[contact] Email delivery failed:", error instanceof Error ? error.message : "Unknown error");
    return response.status(502).json({
      error: "Your message could not be delivered. Please try again or use the email link.",
    });
  }
});

app.use("/api", (_request, response) => {
  response.status(404).json({ error: "API endpoint not found." });
});

app.use(express.static(distPath));
app.use((_request, response) => {
  response.sendFile(path.join(distPath, "index.html"), (error) => {
    if (error) response.status(404).send("Build the frontend first with npm run build.");
  });
});

app.use((error, _request, response, next) => {
  if (response.headersSent) return next(error);
  if (error instanceof SyntaxError && "body" in error) {
    return response.status(400).json({ error: "Request body must be valid JSON." });
  }
  if (error.status === 413) {
    return response.status(413).json({ error: "Request body is too large." });
  }
  console.error("[api] Request failed:", error instanceof Error ? error.message : "Unknown error");
  return response.status(500).json({ error: "The request could not be completed." });
});

app.listen(port, () => {
  console.log(`Portfolio server listening on http://localhost:${port}`);
});
