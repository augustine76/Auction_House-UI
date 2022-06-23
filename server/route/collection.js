import express from "express"
import { addCollection, fetchAllCollection, fetchCollection, FetchListedNftsOfCollection,getCollectionInfo } from "../controller/collection.js";

const router = express.Router()

router.post('/addCollection',addCollection);
router.get('/fetchCollection',fetchCollection);
router.get('/fetchAllCollection',fetchAllCollection);
router.get('/FetchListedNftsOfCollection/:name',FetchListedNftsOfCollection);
router.get('/getCollectionInfo/:name',getCollectionInfo);
export default router;