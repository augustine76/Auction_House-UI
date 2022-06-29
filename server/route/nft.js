import express from 'express'
import {
  createListedNfts,
  fetchAllNfts,
  fetchAllUserOwnedNfts,
  createExecuteSale,
  createBuy,
  createCollection,
  fetchUserCollectionOwnedNft,
  fetchAllCollections,
  fetchUserCollections,
  fetchTotalTradingVolume,
  fetchTotalTradingVolumeBasedOnTimestamp,
  fetchUserCollectionTradingHistory,
  fetchMarketplaceTradingHistory
} from '../controller/api.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/createListedNfts', createListedNfts)
router.post('/createExecuteSale', createExecuteSale)
router.post('/createBuy', createBuy)
router.post('/createCollection', createCollection)
router.get('/fetchAllNfts', fetchAllNfts)
router.get('/fetchAllUserOwnedNfts', fetchAllUserOwnedNfts)
router.get('/fetchUserCollectionOwnedNft', fetchUserCollectionOwnedNft)
router.get('/fetchAllCollections', fetchAllCollections)
router.get('/fetchUserCollections', fetchUserCollections)
router.get('/fetchTotalTradingVolume', fetchTotalTradingVolume)
router.get('/fetchTotalTradingVolumeBasedOnTimestamp', fetchTotalTradingVolumeBasedOnTimestamp)
router.get('/fetchUserCollectionTradingHistory', fetchUserCollectionTradingHistory)
router.get('/fetchMarketplaceTradingHistory', fetchMarketplaceTradingHistory)
export default router
