import express from "express"
import {createUser, fetchAllUsers,getUserDetails} from "../controller/api.js";
import { addCollection, fetchAllCollection, fetchCollection, FetchListedNftsOfCollection } from "../controller/collection.js";

const router = express.Router()


router.post('/createUser', createUser);
router.get("/fetchAllUsers", fetchAllUsers);
router.get('/getUserDetails/:id', getUserDetails);

export default router;