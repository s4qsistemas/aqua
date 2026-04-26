import { Router } from "express";
import { login, getMe } from "./auth.controller";
import { verifyToken } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/login", login);
router.get("/me", verifyToken, getMe);

export default router;
