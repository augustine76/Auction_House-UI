import { User, Nft, Signature } from "../model/schema.js";
import sendToken from "../utils/jwtToken.js";

//edit profile:- submit button
export const createUser = async (req, res) => {

    try {
        const { email, publicKey, username, userType } = req.body
        const newUser = new User({
            email,
            publicKey,
            username,
            userType
        })
        const existingUser = await User.findOne({ publicKey })
        if (existingUser) {
            res.json({
                status: false,
                message: "User already exists."
            })
        } else {
            newUser.save(async (_, user) => {
                res.status(201).json(user);
                console.log(user.email);
            })
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

//lsting nfts
export const createListedNfts = async (req, res) => {
    try {

        const { publicKey } = req.body
        const user = await User.findOne({
            publicKey, userType: "seller"
        })
        // console.log('user.userType ===>', user.userType)
        if (user) {
            const { url, amountToSell, auctionHouseKey, amountToBuy, mintKey } = req.body
            const newNft = new Nft({
                url, publicKey, auctionHouseKey, amountToSell, amountToBuy, mintKey, userType: user.userType
            })
            newNft.sellerWallet = user.publicKey;
            newNft.buyerWallet = "";
            newNft.amountToBuy = 0;
            newNft.isListed = true;
            newNft.save(async (_, nft) => {
                res.status(201).json(nft);
                console.log("nft ===>", nft)
            })
        }else return res.status(404).json({
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
        const { publicKey, mintKey } = req.body
        const user = await User.findOne({
            publicKey, userType: "buyer"
        })
        const findMintKey = await Nft.findOne({
            mintKey
        })
        if (user) {
            const { amountToBuy, amountToSell } = req.body
            console.log("findMintKey.amountToSell ===>", findMintKey.amountToSell)
            console.log("findMintKey.amountToBuy ===>", findMintKey.amountToBuy)
            console.log("amountToBuy ===>", amountToBuy)
            console.log("amountToSell ===>", amountToSell)
            console.log("findMintKey.isBuy ===>", findMintKey.isBuy)
            console.log("findMintKey.isListed ===>", findMintKey.isListed)
            if (findMintKey.amountToSell == amountToBuy && findMintKey.isListed == true && findMintKey.isBuy == false && findMintKey.isSell == false) {
                var myquery = { amountToBuy: 0, buyerWallet: "", isBuy: false };
                var newvalues = { $set: { amountToBuy, buyerWallet: findMintKey.publicKey, isBuy: true } };
                const updateValues = await Nft.updateMany(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                });
                res.status(201).json(updateValues);

            } else {
                return res.status(404).json({
                    success: false,
                    message: "Buy amount does not match with sell amount."
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
export const createSell = async (req, res) => {
    try {

        const { buyerWallet, sellerWallet, mintKey } = req.body
        const checkWallet = await Nft.findOne({
            buyerWallet, sellerWallet
        })
        const findMintKey = await Nft.findOne({
            mintKey
        })
        if (checkWallet) {
            const { amountToBuy, amountToSell } = req.body
            console.log("findMintKey.amountToSell ===>", findMintKey.amountToSell)
            console.log("findMintKey.amountToBuy ===>", findMintKey.amountToBuy)
            console.log("amountToBuy ===>", amountToBuy)
            console.log("amountToSell ===>", amountToSell)
            console.log("findMintKey.isBuy ===>", findMintKey.isBuy)
            console.log("findMintKey.isListed ===>", findMintKey.isListed)
            if (findMintKey.amountToSell == findMintKey.amountToBuy && findMintKey.isBuy == true && findMintKey.isListed == true && findMintKey.isSell == false) {
                var myquery = { isSell: false };
                var newvalues = { $set: { isSell: true } };
                const updateValues = await Nft.updateMany(myquery, newvalues, function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                });
                res.status(201).json(updateValues);
            }else {
                return res.status(404).json({
                    success: false,
                    message: "Buy amount does not match with sell amount."
                })
            }
        }else {
            return res.status(404).json({
                success: false,
                message: "Buyer wallet or Seller wallet account address does not match."
            })
        }
    }catch (error) {
        console.log(error.reason)
        return res.status(409).json({ error: error.message })
    }
}

//signing signature
export const signSignature = async (req, res) => {
    try {

        const { publicKey } = req.body
        const user = await User.findOne({
            publicKey
        })
        if (user) {
            const { signature } = req.body
            const newSignature = new Signature({
                signature
            })
            newSignature.isSigned = true;
            newSignature.save(async (_, signature) => {
                res.status(201).json(signature);
            })
        } else if (!user) return res.status(404).json({
            success: false,
            message: "User not found."
        })

    } catch (error) {
        return res.status(409).json({ error: error.message })
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
export const fetchAllListedNfts = async (req, res) => {
    try {
        const { publicKey } = req.body
        const user = await User.findOne({
            publicKey
        })
        if (user) {
            const nft = await Nft.find({
                publicKey
            })
            if (!nft) {
                return res.status(404).json({
                    success: false,
                    message: "No nft found."
                })
            } else {
                res.status(200).json({
                    success: true,
                    message: nft
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

//users list
export const fetchAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        if (!users) return res.status(404).json({
            success: false,
            message: "No nft found."
        })
        res.status(200).json({
            success: true,
            message: users
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}