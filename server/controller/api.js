import { Console } from 'console'
import { User, Nft, Collection } from '../model/schema.js'
import sendToken from '../utils/jwtToken.js'

//create user
export const createUser = async (req, res) => {
  try {
    const { publicKey, signature } = req.body
    const newUser = new User({
      publicKey,
      signature,
    })
    const existingUser = await User.findOne({ publicKey })
    if (existingUser) {
      return res.status(404).json({
        success: false,
        message: 'User already exists.',
      })
    } else {
      newUser.isSigned = true
      newUser.userEmail = ''
      newUser.userName = ''
      newUser.displayName = ''
      newUser.save(async (_, user) => {
        res.status(201).json(user)
      })
    }
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

//edit profile:- submit button
export const editUser = async (req, res) => {
  try {
    const { publicKey, userEmail, userName, displayName } = req.body
    const user = await User.findOne({ publicKey })
    const isSign = await User.findOne({ publicKey, isSigned: true })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    } else {
      if (isSign) {
        var myquery = {
          publicKey: user.publicKey,
          userEmail: user.userEmail,
          userName: user.userName,
          displayName: user.displayName,
        }
        var newvalues = { $set: { userEmail, userName, displayName } }
        const updateValues = await User.updateOne(myquery, newvalues, function (
          err,
          res,
        ) {
          if (err) throw err
          console.log('User profile edited successfully.')
        })
        res.status(201).json(updateValues)
      } else {
        return res.status(404).json({
          success: false,
          message: 'User is signedOut.',
        })
      }
    }
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

//signIn
export const signIn = async (req, res) => {
  try {
    const { publicKey, signature } = req.body
    const user = await User.findOne({ publicKey })
    const userSignedIn = await User.findOne({ publicKey, isSigned: true })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    } else {
      if (!userSignedIn) {
        var myquery = {
          publicKey: user.publicKey,
          isSigned: false,
          signature: user.signature,
        }
        var newvalues = { $set: { isSigned: true, signature } }
        const updateValues = await User.updateOne(myquery, newvalues, function (
          err,
          res,
        ) {
          if (err) throw err
          console.log('User signedIn successfully.')
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'User is already signedIn.',
        })
      }
    }
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

//signout
export const signOut = async (req, res) => {
  try {
    const { publicKey } = req.body
    const user = await User.findOne({ publicKey })
    const userSignedOut = await User.findOne({ publicKey, isSigned: false })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    } else {
      if (!userSignedOut) {
        var myquery = {
          publicKey: user.publicKey,
          isSigned: true,
          signature: user.signature,
        }
        var newvalues = { $set: { isSigned: false, signature: '' } }
        const updateValues = await User.updateOne(myquery, newvalues, function (
          err,
          res,
        ) {
          if (err) throw err
          console.log('User signedOut successfully')
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'User is already signedOut.',
        })
      }
    }
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

// export const createSignIn = async (req, res) => {
//     try {
//         const {username, email} = req.body
//         const user = await User.findOne({
//             username, email
//         })
//         if(user){
//             sendToken(user,res);
//         }else if(user){
//             res.status(200).json(user)
//         }else if(!user) return res.status(404).json({
//             success:false,
//             message:"User not found."
//         })
//     } catch (error) {
//         res.status(409).json({ error: error.message })
//     }
// }

//creating collection
export const createCollection = async (req, res) => {
  try {
    const { publicKey } = req.body
    const user = await User.findOne({
      publicKey,
    })
    if (user) {
      const {
        publicKey,
        collectionName,
        symbol,
        description,
        image,
        auctionHouseKey,
      } = req.body
      const findCollection = await Collection.findOne({
        publicKey,
        collectionName,
      })
      if (!findCollection) {
        const newCollection = new Collection({
          publicKey,
          collectionName,
          symbol,
          description,
          image,
          auctionHouseKey,
        })
        newCollection.isCollectionCreated = true
        newCollection.floorPrice = 0
        newCollection.totalListedNfts = 0
        newCollection.totalUniqueHolders = 0
        newCollection.tradingVolume = 0
        const collection = await newCollection.save()
        return res.status(201).json({
          success: true,
          message: 'Collection created successfully.',
          data: collection,
        })
      } else {
        return res.status(404).json({
          success: false,
          message: 'Collection is already created.',
        })
      }
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

//lsting nfts
export const createListedNfts = async (req, res) => {
  try {
    const { publicKey, mintKey, collectionName } = req.body
    const user = await User.findOne({
      publicKey,
    })
    const findMintKey = await Nft.findOne({
      publicKey,
      mintKey,
      isExecuteSale: false,
    })
    const findCollection = await Collection.findOne({
      publicKey,
      collectionName,
    })
    const cancelNftListing = await Nft.findOne({
      publicKey,
      collectionName,
      mintKey,
      isListed: false,
    })
    if (user) {
      if (findCollection) {
        const { url, amount, auctionHouseKey, mintKey } = req.body
        var totalListedNft = findCollection.totalListedNfts
        const newNft = new Nft(
          {
            url,
            publicKey,
            mintKey,
            auctionHouseKey,
            amount,
            collectionName,
          },
          totalListedNft++,
        )
        if (newNft.mintKey && newNft.publicKey) {
          if (amount != 0) {
            if (cancelNftListing) {
              var myquery = {
                publicKey: user.publicKey,
                collectionName: findCollection.collectionName,
                mintKey: findMintKey.mintKey,
                isListed: false,
                amount: findMintKey.amount,
              }
              var newvalues = { $set: { isListed: true, amount } }
              const updateValues = await Nft.updateOne(
                myquery,
                newvalues,
                function (err, res) {
                  if (err) throw err
                  console.log('User`s cancel nft listed updated successfully.')
                },
              )
            }
            if (!findMintKey) {
              newNft.sellerWallet = user.publicKey
              newNft.buyerWallet = ''
              newNft.isListed = true
              await newNft.save(async (_, nft) => {
                res.status(201).json(nft)
              })
              var myquery = {
                publicKey: user.publicKey,
                collectionName: findCollection.collectionName,
                totalListedNfts: findCollection.totalListedNfts,
              }
              var newvalues = {
                $set: {
                  totalListedNfts: totalListedNft,
                },
              }
              Collection.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err
              })
              const findNft = await Nft.findOne({
                publicKey,
                collectionName,
              })
                .sort({ amount: +1 })
                .limit(1)
              if (findCollection.floorPrice == 0) {
                var myquery = {
                  publicKey: user.publicKey,
                  collectionName: findCollection.collectionName,
                  floorPrice: 0,
                }
                var newvalues = { $set: { floorPrice: amount } }
                const updateValues = await Collection.updateOne(
                  myquery,
                  newvalues,
                  function (err, res) {
                    if (err) throw err
                    console.log('Floor Price for collection updated properly.')
                  },
                )
              } else if (findNft.amount > amount) {
                var myquery = {
                  publicKey: user.publicKey,
                  collectionName: findCollection.collectionName,
                  floorPrice: findCollection.floorPrice,
                }
                var newvalues = { $set: { floorPrice: amount } }
                const updateValues = await Collection.updateOne(
                  myquery,
                  newvalues,
                  function (err, res) {
                    if (err) throw err
                    console.log('Floor Price for collection updated properly..')
                  },
                )
              }
            } else {
              return res.status(404).json({
                success: false,
                message: 'Cannot list the nft twice.',
              })
            }
          } else {
            return res.status(404).json({
              success: false,
              message: 'Amount cannot be 0.',
            })
          }
        } else {
          return res.status(404).json({
            success: false,
            message: 'MintKey not found.',
          })
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'No collection is created.',
        })
      }
    } else
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

//Cancel listing nft's
export const cancelListingNft = async (req, res) => {
  try {
    const { publicKey, mintKey, collectionName, auctionHouseKey } = req.body
    const user = await User.findOne({ publicKey })
    const findCollection = await Collection.findOne({
      publicKey,
      collectionName,
    })
    const findMintKey = await Nft.findOne({
      publicKey,
      mintKey,
      auctionHouseKey,
    })
    const cancelNftListing = await Nft.findOne({
      publicKey,
      collectionName,
      mintKey,
      isListed: false,
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    } else {
      if (findCollection) {
        if (findMintKey) {
          if (!cancelNftListing) {
            var myquery = {
              publicKey: user.publicKey,
              collectionName: findMintKey.collectionName,
              mintKey: findMintKey.mintKey,
              isListed: true,
            }
            var newvalues = { $set: { isListed: false } }
            const updateValues = await Nft.updateOne(
              myquery,
              newvalues,
              function (err, res) {
                if (err) throw err
                console.log('User cancelled nft sale or buy successfully')
              },
            )
          } else {
            return res.status(404).json({
              success: false,
              message:
                'User already cancelled nft sale or buy at this mintKey successfully.',
            })
          }
        } else {
          return res.status(404).json({
            success: false,
            message: 'No mintKey found.',
          })
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'No collection found for this publicKey.',
        })
      }
    }
  } catch (error) {
    return res.status(409).json({ error: error.message })
  }
}

//buying nfts
export const createBuy = async (req, res) => {
  try {
    const { publicKey, mintKey, collectionName, auctionHouseKey } = req.body
    const user = await User.findOne({
      publicKey,
    })
    const findMintKey = await Nft.findOne({
      collectionName,
      mintKey,
      isExecuteSale: false,
    })
    const findCollection = await Collection.findOne({
      collectionName,
      isCollectionCreated: true,
    })
    if (user) {
      if (findCollection) {
        const { collectionName, publicKey, amount, mintKey } = req.body
        if (findMintKey.sellerWallet != publicKey) {
          if (
            findMintKey.mintKey == mintKey &&
            findMintKey.amount == amount &&
            findMintKey.isListed == true &&
            findMintKey.isBuy == false &&
            findMintKey.auctionHouseKey == auctionHouseKey &&
            findMintKey.isExecuteSale == false
          ) {
            var tradingVolumeOfBuyingNfts = findCollection.tradingVolume
            tradingVolumeOfBuyingNfts += amount
            var myquery = {
              collectionName: findCollection.collectionName,
              tradingVolume: findCollection.tradingVolume,
            }
            var newvalues = {
              $set: {
                tradingVolume: tradingVolumeOfBuyingNfts,
              },
            }
            Collection.updateOne(myquery, newvalues, function (err, res) {
              if (err) throw err
            })
            const findNftUniqueHoldersOfCollection = await Nft.findOne({
              collectionName,
            }).distinct('buyerWallet')
            if (findCollection.totalUniqueHolders > 0) {
              var myquery = {
                collectionName: findCollection.collectionName,
                totalUniqueHolders: findCollection.totalUniqueHolders,
              }
              var newvalues = {
                $set: {
                  totalUniqueHolders: findNftUniqueHoldersOfCollection.length,
                },
              }
              Collection.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err
              })
            } else if (findCollection.totalUniqueHolders == 0) {
              var myquery = {
                collectionName: findCollection.collectionName,
                totalUniqueHolders: 0,
              }
              var newvalues = {
                $set: {
                  totalUniqueHolders: publicKey.length,
                },
              }
              Collection.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err
              })
            }
            var myquery = {
              mintKey: findMintKey.mintKey,
              buyerWallet: '',
              isBuy: false,
            }
            var newvalues = {
              $set: {
                buyerWallet: publicKey,
                isBuy: true,
              },
            }
            const updateValues = await Nft.updateOne(
              myquery,
              newvalues,
              function (err, res) {
                if (err) throw err
                console.log('User bought Nft successfly.')
              },
            )
            res.status(201).json(updateValues)
          } else {
            return res.status(404).json({
              success: false,
              message: 'Buy amount does not match with sell amount.',
            })
          }
        } else {
          return res.status(404).json({
            success: false,
            message: 'Seller cannot buy its own item.',
          })
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'No collection is created.',
        })
      }
    } else if (!user)
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
  } catch (error) {
    console.log(error.reason)
    return res.status(409).json({ error: error.message })
  }
}

//selling nfts:- execute sell
export const createExecuteSale = async (req, res) => {
  try {
    const {
      buyerWallet,
      sellerWallet,
      mintKey,
      collectionName,
      auctionHouseKey,
    } = req.body
    const checkWallet = await Nft.findOne({
      buyerWallet,
      sellerWallet,
    })
    const findMintKey = await Nft.findOne({
      mintKey,
      collectionName,
      isListed: true,
      isBuy: true,
      isExecuteSale: false,
    })
    const findCollection = await Collection.findOne({
      collectionName,
      isCollectionCreated: true,
    })
    if (checkWallet) {
      if (findCollection) {
        var tradingVolumeOfListedNfts = findCollection.tradingVolume
        const { amount } = req.body
        tradingVolumeOfListedNfts += amount
        if (
          findMintKey.amount == amount &&
          findMintKey.amount == amount &&
          findMintKey.auctionHouseKey == auctionHouseKey &&
          findMintKey.isListed == true &&
          findMintKey.isBuy == true &&
          findMintKey.isExecuteSale == false
        ) {
          var myquery = {
            collectionName: findCollection.collectionName,
            tradingVolume: findCollection.tradingVolume,
          }
          var newvalues = {
            $set: {
              tradingVolume: tradingVolumeOfListedNfts,
            },
          }
          Collection.updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err
          })
          var myquery = {
            mintKey: findMintKey.mintKey,
            isExecuteSale: false,
          }
          var newvalues = {
            $set: {
              isExecuteSale: true,
            },
          }
          const updateValues = await Nft.updateOne(
            myquery,
            newvalues,
            function (err, res) {
              if (err) throw err
              console.log('Sale executed successfully.')
            },
          )
          res.status(201).json(updateValues)
        } else {
          return res.status(404).json({
            success: false,
            message: 'Buy amount does not match with sell amount.',
          })
        }
      } else {
        return res.status(404).json({
          success: false,
          message: 'No collection is created.',
        })
      }
    } else {
      return res.status(404).json({
        success: false,
        message:
          'Buyer wallet or Seller wallet account address does not match.',
      })
    }
  } catch (error) {
    console.log(error.reason)
    return res.status(409).json({ error: error.message })
  }
}

//fetch user collection nft's
export const fetchUserCollectionOwnedNft = async (req, res) => {
  try {
    const { publicKey, collectionName } = req.body
    const user = await User.findOne({
      publicKey,
      isSigned: true,
    })
    if (user) {
      const collection = await Collection.findOne({
        publicKey,
        collectionName,
      })
      if (collection) {
        const nft = await Nft.find({
          publicKey,
          collectionName,
        })
        if (nft) {
          res.status(200).json({
            success: true,
            message: nft,
          })
        } else {
          res.status(404).json({
            success: false,
            message: "No nft's found for this collection.",
          })
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'No collection exists for this publicKey.',
        })
      }
    } else
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//fetch all collections
export const fetchAllCollections = async (req, res) => {
  try {
    const collection = await Collection.find({})
    if (collection) {
      res.status(200).json({
        success: true,
        data: collection,
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'No collection exists.',
      })
    }
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//fetch user collection
export const fetchUserCollections = async (req, res) => {
  try {
    const { publicKey } = req.body
    const user = await User.findOne({
      publicKey,
      isSigned: true,
    })
    if (user) {
      const collection = await Collection.find({ publicKey: user.publicKey })
      res.status(200).json({
        success: true,
        data: collection,
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    }
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//browse:- nfts listed for sale
export const fetchAllNfts = async (req, res) => {
  try {
    // const {isListed} = req.body
    const nfts = await Nft.find({
      isListed: true,
    })
    if (nfts) {
      res.status(200).json({
        success: true,
        message: nfts,
      })
    } else {
      return res.status(404).json({
        success: false,
        message: 'No nfts are on sale.',
      })
    }
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//collections:- nfts owned
export const fetchAllUserOwnedNfts = async (req, res) => {
  try {
    const { publicKey } = req.body
    const user = await User.findOne({
      publicKey,
      isSigned: true,
    })
    if (user) {
      const nft = await Nft.find({
        publicKey,
      })
      res.status(200).json({
        success: true,
        message: nft,
      })
    } else
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//users list
export const fetchAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    if (!users)
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
    res.status(200).json({
      success: true,
      message: users,
    })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//fetch total trading volume of the marketplace
export const fetchTotalMarketplaceTradingVolume = async (req, res) => {
  try {
    const totalTradingVolume1 = Collection.aggregate([
      {
        $group: {
          _id: '',
          tradingVolume: { $sum: '$tradingVolume' },
        },
      },
      {
        $project: {
          _id: 0,
          totalTradingVolume: '$tradingVolume',
        },
      },
    ])
    const JSONobject = JSON.stringify(await totalTradingVolume1).toString()
    res.status(200).json({
      success: true,
      message: JSONobject,
    })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//fetch total trading volume of the marketplace based on the timestamp
export const fetchTotalMarketplaceTradingVolumeBasedOnTimestamp = async (
  req,
  res,
) => {
  try {
    const totalTradingVolume1 = Collection.aggregate([
      {
        $match: {
          createdAt: {
            $gt: new Date(Date.now() - 24 * 60 * 60 * 1000), //For production: last 24 hours
            // "createdAt": { $gt: new Date(Date.now() -  1000 * 60 * 20) //For development: last 1 mins
          },
        },
      },
      {
        $group: {
          _id: '',
          tradingVolume: { $sum: '$tradingVolume' },
          first: { $first: '$$ROOT' },
          last: { $last: '$$ROOT' },
        },
      },
      {
        $project: {
          _id: 0,
          totalTradingVolume: '$tradingVolume',
        },
      },
    ])
    const JSONobject = JSON.stringify(await totalTradingVolume1).toString()
    res.status(200).json({
      success: true,
      message: JSONobject,
    })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//user trading history
export const fetchUserCollectionTradingHistory = async (req, res) => {
  try {
    const { publicKey, collectionName } = req.body
    const user = await User.findOne({
      publicKey,
      isSigned: true,
    })
    if (user) {
      const collection = await Collection.findOne({
        publicKey,
        collectionName,
      })
      if (collection) {
        const nftWithExecutedSale = await Nft.find({
          publicKey,
          collectionName,
          isExecuteSale: true,
        })
        const nftwithCancelledSaleOrBuy = await Nft.find({
          publicKey,
          collectionName,
          isListed: false,
        })
        if (nftWithExecutedSale) {
          res.status(200).json({
            success: true,
            message: nftWithExecutedSale,
            nftwithCancelledSaleOrBuy,
          })
        } else {
          res.status(404).json({
            success: false,
            message: "No nft's are sold for this collection",
          })
        }
      } else {
        res.status(404).json({
          success: false,
          message: 'No collection exists for this publicKey.',
        })
      }
    } else
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      })
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

//marketplace trading history
export const fetchMarketplaceTradingHistory = async (req, res) => {
  try {
    const nft = await Nft.find({
      isExecuteSale: true,
    })
    if (nft) {
      res.status(200).json({
        success: true,
        message: nft,
      })
    } else {
      res.status(404).json({
        success: false,
        message: "No nft's are sold for this collection",
      })
    }
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}