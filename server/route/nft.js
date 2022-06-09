import express from "express"
import {createListedNfts, fetchAllNfts, fetchAllListedNfts, signSignature, createSell, createBuy} from "../controller/api.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post('/createListedNfts', createListedNfts);
router.get("/fetchAllNfts", fetchAllNfts);
router.get("/fetchAllListedNfts", fetchAllListedNfts);
router.post("/signSignature", signSignature);
router.post("/createSell", createSell);
router.post("/createBuy", createBuy);

export default router;