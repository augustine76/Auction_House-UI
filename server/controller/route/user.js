import express from "express"
import {createUser, fetchAllUsers} from "../controller/api.js";

const router = express.Router()


router.post('/createUser', createUser);
router.get("/fetchAllUsers", fetchAllUsers);

export default router;