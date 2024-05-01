import express from "express";
import { db } from "../db.js";
import { isAdmin } from "../guards/auth.js";

export const blogRouter = express.Router();

// Create a new blog
// -----------------

blogRouter.post(
  "/admin/blog",
  // Allow only admins
  isAdmin,
  // The actual generation process
  async (req, res) => {
    await db.query(
      "INSERT INTO blog (title, banner, content) VALUES (?, ?, ?)",
      [req.body.title, req.body.banner, req.body.content],
    );
    return res.json({ success: true });
  },
);

// Delete a new blog
// -----------------

blogRouter.delete(
  "/admin/blog/:id",
  // Allow only admins
  isAdmin,
  // The actual generation process
  async (req, res) => {
    await db.query("DELETE FROM blog WHERE id = ?", [req.params.id]);
    return res.json({ success: true });
  },
);

// Edit a blog
// -----------

blogRouter.patch("/admin/blog/:id", async (req, res) => {
  await db.query(
    "UPDATE blog SET title = ?, banner = ?, content = ?, updated_at = ? WHERE id = ?",
    [
      req.body.title,
      req.body.banner,
      req.body.content,
      new Date(),
      req.params.id,
    ],
  );
  return res.json({ success: true });
});

// Get all blogs
// -------------

blogRouter.get("/blog", async (_req, res) => {
  const [blogs] = await db.query("SELECT * FROM blog ORDER BY created_at DESC");
  return res.json({ blogs });
});

// Get a blog details
// ------------------

blogRouter.get("/blog/:id", async (req, res) => {
  const [blog] = await db.query("SELECT * FROM blog WHERE id = ?", [
    req.params.id,
  ]);
  return res.json({ blog: blog[0] });
});
