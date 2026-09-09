import { Router } from "express";
import {
  createBlogHandler,
  updateBlogHandler,
  deleteBlogHandler,
  getBlogsHandler,
  getBlogByIdHandler,
} from "../controller/blogs.controller.js";
import authMiddleWare from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/blogs", getBlogsHandler);
router.post("/blogs/create", authMiddleWare, createBlogHandler);
router.put("/blogs/update/:id", authMiddleWare, updateBlogHandler);
router.delete("/blogs/delete/:id", authMiddleWare, deleteBlogHandler);
router.get("/blogs/:id", getBlogByIdHandler);

export default router;
