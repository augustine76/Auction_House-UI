import express from "express"
import {createnft, fetchAllNfts} from "../controller/api.js";

const router = express.Router()


router.post('/createNFTS', createnft);
router.get("/fetchAllNfts", fetchAllNfts)


export default router;