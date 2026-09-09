import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import usersRoute from "./routes/users.route.js";
import blogsRoute from "./routes/blogs.route.js";

const app=express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", authRoute);
app.use("/api", usersRoute);
app.use("/api", blogsRoute);

export default app;