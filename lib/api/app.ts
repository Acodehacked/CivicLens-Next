import { Hono } from "hono";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { posts } from "@/db/schema";
import { requireUser } from "./auth";

const app = new Hono().basePath("/api");

app.get("/health", (c) => c.json({ ok: true }));

app.get("/posts", async (c) => {
  const allPosts = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return c.json(allPosts);
});

app.post("/posts", requireUser, async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json<{ title?: string; content?: string }>();

  if (!body.title?.trim()) {
    return c.json({ error: "title is required" }, 400);
  }

  const [post] = await db
    .insert(posts)
    .values({ authorId: userId, title: body.title, content: body.content ?? "" })
    .returning();

  return c.json(post, 201);
});

app.delete("/posts/:id", requireUser, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const [deleted] = await db
    .delete(posts)
    .where(and(eq(posts.id, id), eq(posts.authorId, userId)))
    .returning();

  if (!deleted) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ ok: true });
});

export default app;
