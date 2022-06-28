// import express from "express"
// import {createListedNfts, fetchAllNfts, fetchAllUserOwnedNfts, signSignature, createExecuteSell, createBuy,getNFTDetails,buy,isListed} from "../controller/api.js";
// import { isAuthenticated } from "../middleware/auth.js";

// const router = express.Router()

// router.post('/createListedNfts', createListedNfts);
// router.get("/fetchAllNfts", fetchAllNfts);
// router.get("/fetchAllUserOwnedNfts", fetchAllUserOwnedNfts);
// router.post("/signSignature", signSignature);
// router.post("/createExecuteSell", createExecuteSell);
// router.post("/createBuy", createBuy);
// router.get("/getNFTDetails/:mint",getNFTDetails);
// router.post("/buy/:mint",buy);
// router.post("/isListed", isListed)

// export default router;
import express from "express"
import {listNFT,getNFTDetails,isListed,listedNFTS,fetchAllUserOwnedNfts, FetchListedOwnedNFTsInCollection,FetchOwnedNFTsInCollection,buyNft} from "../controller/nfts.js"
const router = express.Router()
router.post('/listNFT', listNFT);
router.get("/getNFTDetails/:mint",getNFTDetails);
router.post("/isListed", isListed);
router.post("/listedNFTS",listedNFTS)
router.get("/fetchAllUserOwnedNfts", fetchAllUserOwnedNfts);
router.post("/FetchListedOwnedNFTsInCollection", FetchListedOwnedNFTsInCollection);
router.post("/FetchOwnedNFTsInCollection",FetchOwnedNFTsInCollection);
router.post("/buyNft",buyNft)
export default router;