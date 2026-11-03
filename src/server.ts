import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { pathToFileURL } from "node:url";

export type Todo = {
  id: string;
  title: string;
  done: boolean;
};

const todos: Todo[] = [];
let nextId = 1;

/** Trivial in-memory create rate limit (demo stub). */
export const MAX_CREATES_PER_PROCESS = 20;
let createCount = 0;

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
    if (createCount >= MAX_CREATES_PER_PROCESS) {
      return send(res, 429, {
        error: "rate limit exceeded",
        limit: MAX_CREATES_PER_PROCESS,
      });
    }
    let payload: { title?: unknown };
    try {
      payload = JSON.parse((await readBody(req)) || "{}");
    } catch {
      return send(res, 400, { error: "invalid JSON" });
    }
    if (typeof payload.title !== "string" || !payload.title.trim()) {
      return send(res, 400, { error: "title is required" });
    }
    const todo: Todo = {
      id: String(nextId++),
      title: payload.title.trim(),
      done: false,
    };
    createCount += 1;
    todos.push(todo);
    return send(res, 201, todo);
  }

  return send(res, 404, { error: "not found" });
}

/** Reset in-memory state (tests only). */
export function resetStore() {
  todos.length = 0;
  nextId = 1;
  createCount = 0;
}

const port = Number(process.env.PORT) || 3000;

const isMain =
  process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  createServer(handleRequest).listen(port, () => {
    console.log(`todo api listening on http://localhost:${port}`);
  });
}
