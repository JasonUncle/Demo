import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";

export type Priority = "low" | "normal" | "high";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
};

const PRIORITIES: readonly Priority[] = ["low", "normal", "high"];

function parsePriority(value: unknown): Priority | null {
  if (value === undefined) return "normal";
  if (typeof value === "string" && (PRIORITIES as readonly string[]).includes(value)) {
    return value as Priority;
  }
  return null;
}

const todos: Todo[] = [];
let nextId = 1;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(json),
  });
  res.end(json);
}

export async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  const method = req.method ?? "GET";
  const url = new URL(req.url ?? "/", "http://localhost");

  if (method === "GET" && url.pathname === "/health") {
    return send(res, 200, { ok: true });
  }

  if (method === "GET" && url.pathname === "/todos") {
    return send(res, 200, todos);
  }

  if (method === "POST" && url.pathname === "/todos") {
    let payload: { title?: unknown; priority?: unknown };
    try {
      payload = JSON.parse((await readBody(req)) || "{}");
    } catch {
      return send(res, 400, { error: "invalid JSON" });
    }
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      return send(res, 400, { error: "title is required" });
    }
    const priority = parsePriority(payload.priority);
    if (priority === null) {
      return send(res, 400, { error: 'priority must be "low" | "normal" | "high"' });
    }
    const todo: Todo = {
      id: String(nextId++),
      title: payload.title.trim(),
      done: false,
      priority,
    };
    todos.push(todo);
    return send(res, 201, todo);
  }

  return send(res, 404, { error: "not found" });
}

/** Reset in-memory state (tests only). */
export function resetStore() {
  todos.length = 0;
  nextId = 1;
}

const port = Number(process.env.PORT) || 3000;

const isMain =
  process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  createServer(handleRequest).listen(port, () => {
    console.log(`todo api listening on http://localhost:${port}`);
  });
}
