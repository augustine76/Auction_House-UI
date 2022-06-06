import express from "express"
import {createNft, fetchAllNfts} from "../controller/api.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post('/createNft',isAuthenticated, createNft);
router.get("/fetchAllNfts", fetchAllNfts);

export default router;