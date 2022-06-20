import { User, Nft, Signature } from "../model/schema.js";
import sendToken from "../utils/jwtToken.js";

//edit profile:- submit button
export const createUser = async (req, res) => {

    try {
        const { publicKey, signature } = req.body
        const newUser = new User({

            publicKey,
            signature,
            isSigned: true
        })
        const existingUser = await User.findOne({ publicKey })
        if (existingUser) {

            existingUser.signature = signature;
            existingUser.isSigned=true;
            existingUser.save();
            return res.status(201).json({
                success: true,
                message: "User already exists.",
                data: existingUser

            })
        } else {
            newUser.save(async (_, user) => {
                res.status(201).json({
                    success: true,
                    message: "User created",
                    data: user
                });

            })
        }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}
export const getUserDetails = async (req, res) => {
    console.log(req)
    try {

        var publicKey = req.params.id;
        console.log('The id: ' + publicKey);
        const user = await User.findOne({
            publicKey
        })
        if (user) {
            return res.status(201).json({
                success: true,
                data: user,
                message: "User Details fetched"
            })


        } else return res.status(404).json({
            success: false,
            message: "User not found."
        })
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

        const { publicKey, mintKey } = req.body
        const user = await User.findOne({
            publicKey
        })
        const findMintKey = await Nft.findOne({
            publicKey, mintKey
        })
        if (user) {
            const { url, amount, auctionHouseKey, mintKey } = req.body
            const newNft = new Nft({
                url, publicKey, mintKey, auctionHouseKey, amount
            })
            const findSignSignature = await Signature.findOne({
                publicKey, isSigned: true
            })

            if (newNft.mintKey && newNft.publicKey) {
                if (!findMintKey) {
                    newNft.sellerWallet = user.publicKey;
                    newNft.buyerWallet = "";
                    newNft.isListed = true;
                    newNft.save(async (_, nft) => {
                        res.status(201).json(nft);
                    })
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
        const { publicKey, mintKey } = req.body
        const user = await User.findOne({
            publicKey
        })
        const findMintKey = await Nft.findOne({
            mintKey
        })
        const findSignSignature = await Signature.findOne({
            publicKey, isSigned: true
        })
        if (user) {
            const { amount, mintKey } = req.body
            if (findSignSignature) {
                if (findMintKey.mintKey == mintKey && findMintKey.amount == amount && findMintKey.isListed == true && findMintKey.isBuy == false && findMintKey.isExecuteSell == false) {
                    var myquery = { mintKey: findMintKey.mintKey, buyerWallet: "", isBuy: false };
                    var newvalues = { $set: { buyerWallet: user.publicKey, isBuy: true } };
                    const updateValues = await Nft.updateOne(myquery, newvalues, function (err, res) {
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

            } else {
                return res.status(404).json({
                    success: false,
                    message: "Signature is not signed by the buyer."
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

        const { buyerWallet, sellerWallet, mintKey } = req.body
        const checkWallet = await Nft.findOne({
            buyerWallet, sellerWallet
        })
        const findMintKey = await Nft.findOne({
            mintKey
        })
        if (checkWallet) {
            const { amount } = req.body
            if (findMintKey.amount == amount && findMintKey.amount == amount && findMintKey.isListed == true && findMintKey.isBuy == true && findMintKey.isExecuteSell == false) {
                var myquery = { mintKey: findMintKey.mintKey, isExecuteSell: false };
                var newvalues = { $set: { isExecuteSell: true } };
                const updateValues = await Nft.updateOne(myquery, newvalues, function (err, res) {
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

//signing signature
export const signSignature = async (req, res) => {
    try {
        const { signature, publicKey } = req.body
        const newSignature = new Signature({
            publicKey, signature
        })
        const findSignSignature = await Signature.findOne({
            publicKey
        })
        if (!findSignSignature) {
            newSignature.isSigned = true;
            newSignature.save(async (_, signature) => {
                res.status(201).json(signature);
            })
        } else {
            return res.status(404).json({
                success: false,
                message: "User with this publicKey already exists."
            })
        }

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

export const isListed = async (req, res) => {
    try{
        const mintKey  = req.query.mintKey;
        console.log("mint", mintKey);
        if( mintKey ) {
            const nft = await Nft.findOne({
                mintKey: mintKey
            })
            if(nft.isListed == true){
                res.status(200).json({
                    success: true,
                    message: true
                })
            }
        }
        else return res.status(404).json({
            success: false,
            message: "mintKey not found."
        })
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

//collections:- nfts owned
export const fetchAllUserOwnedNfts = async (req, res) => {
    try {
        const { publicKey } = req.body
        const user = await User.findOne({
            publicKey
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