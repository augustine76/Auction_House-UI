import express from "express"
import {createNft, fetchAllNfts} from "../controller/user.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post('/createNft', createNft);
router.get("/fetchAllNfts", fetchAllNfts);


export default router;