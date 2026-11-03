# Demo Todo API / 演示待办 API

Tiny in-memory todo HTTP API for a **Grok Bot multi-agent live demo**.  
极简内存版待办 HTTP API，用于 **Grok Bot 多 Agent 现场协作演示**。

## Run / 运行

```bash
npm install && npm test && npm run dev
```

Server listens on `http://localhost:3000` (or `PORT`).

## API

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | `{ ok: true }` |
| `GET` | `/todos` | paginated list `{ items, total, limit, offset }` — `?limit=20&offset=0` (max limit 100) |
| `POST` | `/todos` | create `{ id, title, done }` — body: `{ "title": "..." }` |

## Demo branches / 演示分支

### `demo/bot-c-pagination` (this branch / 本分支)

Bot C adds simple pagination to `GET /todos` via `limit` (default 20, max 100) and `offset` (default 0).  
Bot C 为 `GET /todos` 增加简单分页：`limit`（默认 20，最大 100）与 `offset`（默认 0）。

## Live demo / 现场演示

Collaboration narrative / 协作叙事:

1. **Bot A** ships a feature on `demo/bot-a-priority` (todo priority).
2. **Bot B** works in parallel on `demo/bot-b-rate-limit` (create rate-limit stub).
3. **Bot C** works in parallel on `demo/bot-c-pagination` (todos pagination).
4. A human / reviewer bot summarizes the open PRs.

Branches / 分支:

- `demo/bot-a-priority`
- `demo/bot-b-rate-limit`
- `demo/bot-c-pagination`

PRs / 合并请求:

- Bot A: https://github.com/JasonUncle/Demo/pull/1
- Bot B: https://github.com/JasonUncle/Demo/pull/2
- Bot C: https://github.com/JasonUncle/Demo/pull/3
