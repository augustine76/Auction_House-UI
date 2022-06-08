import { User,Nft } from "../model/schema.js";
import sendToken from "../utils/jwtToken.js";

//edit profile:- submit button
export const createUser = async (req, res) => {
    
    try {
        const { email, publicKey, username} = req.body
        const newUser = new User({
            email,
            publicKey,
            username
        })
        const existingUser = await User.findOne({publicKey})
        if(existingUser){
            res.json({
                status:false,
                message:"User already exists."
            })
        }else{
            newUser.save(async(_, user) => {
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

//selling nfts
export const createSell = async (req, res) => {
    try {

        const { publicKey } = req.body
        const user = await User.findOne({
            publicKey
        })
        if(user){
            const { url, amount } = req.body
            const newNft = new Nft({
                url, publicKey, amount
            })
            newNft.isSell = true;
            newNft.save(async(_, nft) => {
                res.status(201).json(nft);
            })
        }else if(user){
            res.status(200).json(user)
        }else if(!user) return res.status(404).json({
            success:false,
            message:"User not found."
        })
    
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

//browse:- nfts listed for sale
export const fetchAllNfts = async (req, res) => {
    try {
        // const {isSell} = req.body
        const nfts = await Nft.find({
            isSell: true
        })
        if(nfts){
                res.status(200).json({
                    success: true,
                    message: nfts
                });
        }else {
                return res.status(404).json({
                success:false,
                message:"No nfts are on sale."
            })
        }

           
        } catch (error) {
            res.status(409).json({ error: error.message })
        }
}

//collections:- nfts owned
export const fetchAllUserNfts = async (req, res) => {
    try {
        const {publicKey} = req.body
        const user = await User.findOne({
            publicKey
        })
        if(user){
            const nft = await Nft.find({
                publicKey
            })
            if(!nft){
                    return res.status(404).json({
                    success: false,
                    message: "No nft found."
                })
            }else{ 
                res.status(200).json({
                    success: true,
                    message: nft
                })
            }
        }else return res.status(404).json({
            success:false,
            message:"User not found."
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