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
| `POST` | `/todos` | create `{ id, title, done }` — body: `{ "title": "..." }` (max 20 creates / process) |

## Demo branches / 演示分支

### `demo/bot-b-rate-limit` (this branch / 本分支)

Bot B adds a trivial in-memory rate-limit stub: `POST /todos` allows at most **20 creates per process**, then returns `429`.  
Bot B 增加简易内存限流：进程内最多创建 20 条待办，超出返回 `429`。

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
