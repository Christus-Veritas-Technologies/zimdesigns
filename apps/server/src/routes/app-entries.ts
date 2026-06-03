import { Hono } from "hono";
import { listAppEntries, getAppEntry } from "../services/app-entries";

const app = new Hono();

app.get("/", async (c) => {
  const entries = await listAppEntries();
  return c.json(entries);
});

app.get("/:slug", async (c) => {
  const { slug } = c.req.param();
  try {
    const entry = await getAppEntry(slug);
    return c.json(entry);
  } catch {
    return c.json({ message: "App not found" }, 404);
  }
});

export default app;
