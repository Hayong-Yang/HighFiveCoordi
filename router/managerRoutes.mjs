import express from "express";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

router.get("/", isAuth, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/manager.html"));
});

export default router;