import express from "express"
import {createUser, getUserDetails} from "../controller/users.js";

const router = express.Router()


router.post('/createUser', createUser);
router.get('/getUserDetails/:id', getUserDetails);

export default router;