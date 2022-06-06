import {User,Nft} from "../model/user.js";
import sendToken from "../utils/jwtToken.js";

export const createSignUp = async (req, res) => {
    
    try {
        const { email, username} = req.body
        const newUser = new User({
            email,
            username
        })
        const existingUser = await User.findOne({email, username})
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

export const createSignIn = async (req, res) => {
    try { 
        const {username, email} = req.body
        const user = await User.findOne({
            username, email
        })
        if(user){
            sendToken(user,res);
        }else if(user){
            res.status(200).json(user)
        }else if(!user) return res.status(404).json({
            sucess:false,
            message:"User not found."
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export const createNft = async (req, res) => {
    try {

        const {username, email} = req.body
        const user = await User.findOne({
            username, email
        })
        if(user){
            const { url } = req.body
            const newNft = new Nft({
                url
            })
            newNft.save(async(_, nft) => {
                res.status(201).json(nft);
            })
        }else if(user){
            res.status(200).json(user)
        }else if(!user) return res.status(404).json({
            sucess:false,
            message:"User not found."
        })
    
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

export const fetchAllNfts = async (req, res) => {
    try {
        const {username, email} = req.body
        const user = await User.findOne({
            username, email
        })
        if(user){
            const { url } = req.body
            const nfts = await Nft.find()
            if (!nfts) return res.status(404).json({
                sucess: false,
                message: "No nft found."
            })
            res.status(200).json({
                sucess: true,
                message: nfts
            })
        }else if(user){
            res.status(200).json(user)
        }else if(!user) return res.status(404).json({
            sucess:false,
            message:"User not found."
        })

           
        } catch (error) {
            res.status(409).json({ error: error.message })
        }
}

export const fetchAllUsers = async (req, res) => {
    try {
        const { url } = req.body
        const users = await User.find()
        if (!users) return res.status(404).json({
            sucess: false,
            message: "No nft found."
        })
        res.status(200).json({
            sucess: true,
            message: users
        })
    } catch (error) {
        res.status(409).json({ error: error.message })
    }
}