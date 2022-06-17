import express from "express"
import { addCollection, fetchAllCollection, fetchCollection, FetchListedNftsOfCollection } from "../controller/collection.js";

const router = express.Router()

router.post('/addCollection',addCollection);
router.get('/fetchCollection',fetchCollection);
router.get('/fetchAllCollection',fetchAllCollection);
router.get('/FetchListedNftsOfCollection',FetchListedNftsOfCollection);

export default router;