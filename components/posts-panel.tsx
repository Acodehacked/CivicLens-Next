"use client";

import { useEffect, useState, type FormEvent } from "react";

type Post = {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
};

async function fetchPosts(): Promise<Post[]> {
  const res = await fetch("/api/posts");
  return res.ok ? res.json() : [];
}

export function PostsPanel({ canPost }: { canPost: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPosts().then((data) => {
      if (cancelled) return;
      setPosts(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to create post");
      return;
    }

    setTitle("");
    setContent("");
    setPosts(await fetchPosts());
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Posts</h2>

      {canPost && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="self-start rounded bg-neutral-900 px-3 py-1.5 text-sm text-white"
          >
            Publish
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-neutral-500">No posts yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {posts.map((post) => (
            <li
              key={post.id}
              className="rounded border border-neutral-200 p-3"
            >
              <p className="font-medium">{post.title}</p>
              {post.content && (
                <p className="text-sm text-neutral-600">{post.content}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
