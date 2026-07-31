import { createMiddleware } from "hono/factory";
import { createClient } from "@/lib/supabase/server";

type AuthVariables = {
  userId: string;
};

// Runs inside the same Next.js request scope as the route handler that
// mounts the Hono app, so `next/headers` cookies() (used by createClient)
// still resolves to the incoming request.
export const requireUser = createMiddleware<{ Variables: AuthVariables }>(
  async (c, next) => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", user.id);
    await next();
  }
);
