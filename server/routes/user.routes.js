import { Router } from "express";

import { registerUser, loginUser, logoutUser } from "../controllers/userManagement.controller.js";

const router = Router();

//EXPORT DATA TO EXCEL
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);

export default router;
