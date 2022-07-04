import express from 'express'
import {
  createListedNfts,
  fetchAllNfts,
  fetchAllUserOwnedNfts,
  createExecuteSale,
  createBuy,
  createCollection,
  cancelListingNft,
  fetchUserCollectionOwnedNft,
  fetchAllCollections,
  fetchUserCollections,
  fetchTotalMarketplaceTradingVolume,
  fetchTotalMarketplaceTradingVolumeBasedOnTimestamp,
  fetchUserCollectionTradingHistory,
  fetchMarketplaceTradingHistory
} from '../controller/api.js'
import { isAuthenticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/createListedNfts', createListedNfts)
router.post('/createExecuteSale', createExecuteSale)
router.post('/createBuy', createBuy)
router.post('/createCollection', createCollection)
router.post('/cancelListingNft', cancelListingNft)
router.get('/fetchAllNfts', fetchAllNfts)
router.get('/fetchAllUserOwnedNfts', fetchAllUserOwnedNfts)
router.get('/fetchUserCollectionOwnedNft', fetchUserCollectionOwnedNft)
router.get('/fetchAllCollections', fetchAllCollections)
router.get('/fetchUserCollections', fetchUserCollections)
router.get('/fetchTotalMarketplaceTradingVolume', fetchTotalMarketplaceTradingVolume)
router.get('/fetchTotalMarketplaceTradingVolumeBasedOnTimestamp', fetchTotalMarketplaceTradingVolumeBasedOnTimestamp)
router.get('/fetchUserCollectionTradingHistory', fetchUserCollectionTradingHistory)
router.get('/fetchMarketplaceTradingHistory', fetchMarketplaceTradingHistory)
export default router
