import { Console } from "console";
import { User, Nft, Collection } from "../model/schema.js";
import sendToken from "../utils/jwtToken.js";

//create user
export const createUser = async (req, res) => {
    try {
        const { publicKey, signature } = req.body
        const newUser = new User({
            publicKey, signature
        })
        const existingUser = await User.findOne({ publicKey })
        if (existingUser) {
            return res.status(404).json({
                success: false,
                message: "User already exists."
            })
        } else {
            newUser.isSigned = true;
            newUser.userEmail = "";
            newUser.userName = "";
            newUser.displayName = "";
            newUser.save(async (_, user) => {
                res.status(201).json(user);
                console.log(newUser.publicKey);
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
                message: "User not found."
            })
        } else {
            if (isSign) {
                var myquery = { publicKey: user.publicKey, userEmail: user.userEmail, userName: user.userName, displayName: user.displayName };
                var newvalues = { $set: { userEmail, userName, displayName } };
                const updateValues = await User.updateOne(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("User profile edited successfully.");
                });
                res.status(201).json(updateValues);
            } else {
                return res.status(404).json({
                    success: false,
                    message: "User is signedOut."
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
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        } else {
            var myquery = { publicKey: user.publicKey, isSigned: false, signature: user.signature };
            var newvalues = { $set: { isSigned: true, signature } };
            const updateValues = await User.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("User signedIn successfully.");
            });
            res.status(201).json({ data: updateValues, message: "User is already signedIn." });
        }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

//signout
export const signOut = async (req, res) => {
    try {
        const { publicKey, signature } = req.body
        const user = await User.findOne({ publicKey })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            })
        } else {
            var myquery = { publicKey: user.publicKey, isSigned: true, signature: user.signature };
            var newvalues = { $set: { isSigned: false, signature: "" } };
            const updateValues = await User.updateOne(myquery, newvalues, function (err, res) {
                if (err) throw err;
                console.log("User signedOut successfully");
            });
            res.status(201).json({ data: updateValues, message: "User is already signedOut." });
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
            publicKey
        })
        if (user) {
            const { publicKey, collectionName, symbol, description, image, auctionHouseKey } = req.body
            const findCollection = await Collection.findOne({
                collectionName
            })
            if (!findCollection) {
                const newCollection = new Collection({
                    publicKey, collectionName, symbol, description, image, auctionHouseKey
                })
                newCollection.isCollectionCreated = true;
                newCollection.floorPrice = 0;
                const collection = await newCollection.save();
                return res.status(201).json({
                    success: true,
                    message: "Collection created successfully.",
                    data: collection
                })
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Collection is already created."
                })
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found."
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
            publicKey
        })
        const findMintKey = await Nft.findOne({
            publicKey, mintKey
        })
        const findCollection = await Collection.findOne({
            publicKey, collectionName
        })
        const findNft = await Nft.findOne({
            publicKey, collectionName
        })
        if (user) {
            if (findCollection) {
                const { url, amount, auctionHouseKey, mintKey } = req.body
                const newNft = new Nft({
                    url, publicKey, mintKey, auctionHouseKey, amount, collectionName
                })
                if (newNft.mintKey && newNft.publicKey) {
                    if (!findMintKey) {
                        newNft.sellerWallet = user.publicKey;
                        newNft.buyerWallet = "";
                        newNft.isListed = true;
                        newNft.save(async (_, nft) => {
                            res.status(201).json(nft);
                        })
                        if (findNft.amount < amount) {
                            findCollection.floorPrice = amount;
                            console.log("findCollection.floorPrice ===>", findCollection.floorPrice)
                            var myquery = { publicKey: user.publicKey, collectionName: findCollection.collectionName, floorPrice: findCollection.floorPrice };
                            var newvalues = { $set: { floorPrice: amount } };
                            const updateValues = await Collection.updateOne(myquery, newvalues, function (err, res) {
                                if (err) throw err;
                                console.log("Floor Price for collection updated properly.");
                            });
                        }
                    }
                    else {
                        return res.status(404).json({
                            success: false,
                            message: "Cannot list the nft twice."
                        })
                    }
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "MintKey not found."
                    })
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "No collection is created."
                })
            }
        } else return res.status(404).json({
            success: false,
            message: "User not found."
        })
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

//buying nfts
export const createBuy = async (req, res) => {
    try {
        const { publicKey, mintKey, collectionName } = req.body
        const user = await User.findOne({
            publicKey
        })
        const findMintKey = await Nft.findOne({
            mintKey
        })
        const findCollection = await Collection.findOne({
            collectionName, isCollectionCreated: true
        })
        if (user) {
            if (findCollection) {
                const { amount, mintKey } = req.body
                if (findMintKey.sellerWallet != publicKey) {
                    if (findMintKey.mintKey == mintKey && findMintKey.amount == amount && findMintKey.isListed == true && findMintKey.isBuy == false && findMintKey.isExecuteSell == false) {
                        var myquery = { mintKey: findMintKey.mintKey, buyerWallet: "", isBuy: false };
                        var newvalues = { $set: { buyerWallet: user.publicKey, isBuy: true } };
                        const updateValues = await Nft.updateOne(myquery, newvalues, function (err, res) {
                            if (err) throw err;
                            console.log("User bought Nft successfly.");
                        });
                        res.status(201).json(updateValues);

                    } else {
                        return res.status(404).json({
                            success: false,
                            message: "Buy amount does not match with sell amount."
                        })
                    }
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "Seller cannot buy its own item."
                    })
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "No collection is created."
                })
            }
        } else if (!user) return res.status(404).json({
            success: false,
            message: "User not found."
        })

    } catch (error) {
        console.log(error.reason)
        return res.status(409).json({ error: error.message })
    }
}

//selling nfts:- execute sell
export const createExecuteSell = async (req, res) => {
    try {

        const { buyerWallet, sellerWallet, mintKey, publicKey, collectionName } = req.body
        const checkWallet = await Nft.findOne({
            buyerWallet, sellerWallet
        })
        const findMintKey = await Nft.findOne({
            mintKey
        })
        const findCollection = await Collection.findOne({
            collectionName, isCollectionCreated: true
        })
        if (checkWallet) {
            if (findCollection) {
                const { amount } = req.body
                if (findMintKey.amount == amount && findMintKey.amount == amount && findMintKey.isListed == true && findMintKey.isBuy == true && findMintKey.isExecuteSell == false) {
                    var myquery = { mintKey: findMintKey.mintKey, isExecuteSell: false };
                    var newvalues = { $set: { isExecuteSell: true } };
                    const updateValues = await Nft.updateOne(myquery, newvalues, function (err, res) {
                        if (err) throw err;
                        console.log("Sell executed successfully.");
                    });
                    res.status(201).json(updateValues);
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "Buy amount does not match with sell amount."
                    })
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "No collection is created."
                })
            }
        } else {
            return res.status(404).json({
                success: false,
                message: "Buyer wallet or Seller wallet account address does not match."
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
            publicKey, isSigned: true
        })
        if (user) {
            const collection = await Collection.findOne({
                publicKey, collectionName
            })
            if (collection) {
                const nft = await Nft.find({
                    publicKey, collectionName
                })
                if (nft) {
                    res.status(200).json({
                        success: true,
                        message: nft
                    })
                } else {
                    res.status(404).json({
                        success: false,
                        message: "No nft's found for this collection."
                    })
                }
            } else {
                res.status(404).json({
                    success: false,
                    message: "No collection exists for this publicKey."
                })
            }
        } else return res.status(404).json({
            success: false,
            message: "User not found."
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
                data: collection
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "No collection exists."
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
            publicKey, isSigned: true
        })
        if (user) {
            const collection = await Collection.find({ publicKey: user.publicKey })
            res.status(200).json({
                success: true,
                data: collection
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "User not found."
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
            isListed: true
        })
        if (nfts) {
            res.status(200).json({
                success: true,
                message: nfts
            });
        } else {
            return res.status(404).json({
                success: false,
                message: "No nfts are on sale."
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
            publicKey, isSigned: true
        })
        if (user) {
            const nft = await Nft.find({
                publicKey
            })
            res.status(200).json({
                success: true,
                message: nft
            })
        } else return res.status(404).json({
            success: false,
            message: "User not found."
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

//users list
export const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users) return res.status(404).json({
            success: false,
            message: "User not found."
        })
        res.status(200).json({
            success: true,
            message: users
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}