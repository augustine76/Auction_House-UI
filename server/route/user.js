import express from "express"
import {createUser, getUserDetails,editUser} from "../controller/users.js";

const router = express.Router()


router.post('/createUser', createUser);
router.get('/getUserDetails/:id', getUserDetails);
router.post('/editUser', editUser);

export default router;