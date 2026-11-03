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
| `GET` | `/todos` | list todos |
| `POST` | `/todos` | create `{ id, title, done }` — body: `{ "title": "..." }` |

## Live demo / 现场演示

Collaboration narrative / 协作叙事:

1. **Bot A** ships a feature on `demo/bot-a-priority` (todo priority).
2. **Bot B** works in parallel on `demo/bot-b-rate-limit` (create rate-limit stub).
3. A human / reviewer bot summarizes both open PRs.

Branches / 分支:

- `demo/bot-a-priority`
- `demo/bot-b-rate-limit`

PRs / 合并请求: _(filled after open)_

- Bot A: _(pending)_
- Bot B: _(pending)_
