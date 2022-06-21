import express from "express"
import { createListedNfts, fetchAllNfts, fetchAllUserOwnedNfts, createExecuteSell, createBuy, createCollection, fetchUserCollectionOwnedNft, fetchAllCollections, fetchUserCollection } from "../controller/api.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router()

router.post('/createListedNfts', createListedNfts);
router.post("/createExecuteSell", createExecuteSell);
router.post("/createBuy", createBuy);
router.post("/createCollection", createCollection);
router.get("/fetchAllNfts", fetchAllNfts);
router.get("/fetchAllUserOwnedNfts", fetchAllUserOwnedNfts);
router.get("/fetchUserCollectionOwnedNft", fetchUserCollectionOwnedNft);
router.get("/fetchAllCollections", fetchAllCollections);
router.get("/fetchUserCollection", fetchUserCollection);

export default router;