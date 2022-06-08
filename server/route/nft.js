import express from "express"
import {createSell, fetchAllNfts, fetchAllUserNfts} from "../controller/api.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post('/createSell', createSell);
router.get("/fetchAllNfts", fetchAllNfts);
router.get("/fetchAllUserNfts", fetchAllUserNfts);

export default router;