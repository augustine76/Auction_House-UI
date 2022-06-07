import express from "express"
import {createSignUp, createSignIn, fetchAllUsers} from "../controller/api.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()


router.post('/createSignUp', createSignUp);
router.post('/createSignIn', createSignIn);
router.get("/fetchAllUsers", fetchAllUsers);

export default router;