import { Router } from "express";

import {registerUser, loginUser} from "../controllers/userManagement.controller.js";

const router = Router();

//EXPORT DATA TO EXCEL
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
