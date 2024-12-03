import { Router } from "express";

import {registerUser} from "../controllers/userManagement.controller.js";


const router = Router();

//EXPORT DATA TO EXCEL
router.post("/register", registerUser);

export default router;
