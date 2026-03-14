import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, insertMessageSchema } from "@workspace/db/schema";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/messages", async (_req, res) => {
  const messages = await db
    .select()
    .from(messagesTable)
    .orderBy(desc(messagesTable.createdAt));
  res.json(messages);
});

router.post("/messages", async (req, res) => {
  const parsed = insertMessageSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }
  const [created] = await db.insert(messagesTable).values(parsed.data).returning();
  res.status(201).json(created);
});

export default router;
