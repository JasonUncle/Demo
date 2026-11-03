import assert from "node:assert/strict";
import { createServer } from "node:http";
import { test, before, after } from "node:test";
import { handleRequest, resetStore } from "../src/server.ts";

let baseUrl: string;
let server: ReturnType<typeof createServer>;

before(async () => {
  resetStore();
  server = createServer(handleRequest);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no address");
  baseUrl = `http://127.0.0.1:${addr.port}`;
});

after(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

test("GET /health returns ok", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
});

test("POST /todos creates a todo", async () => {
  resetStore();
  const res = await fetch(`${baseUrl}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "demo task" }),
  });
  assert.equal(res.status, 201);
  const body = (await res.json()) as { id: string; title: string; done: boolean };
  assert.equal(body.title, "demo task");
  assert.equal(body.done, false);
  assert.ok(body.id);

  const list = await fetch(`${baseUrl}/todos`);
  assert.equal(list.status, 200);
  const todos = (await list.json()) as unknown[];
  assert.equal(todos.length, 1);
});
