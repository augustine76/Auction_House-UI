import User from "../model/user.js";

export const createnft = async (req, res) => {
    try {
        const { url } = req.body
        const newUser = new User({
            url
        })
        // newUser.save()
            newUser.save(async(_, user) => {
            res.status(201).json(user);
            console.log(user.email);
            })
    
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}

export const fetchAllNfts = async (req, res) => {
        try {
            const { url } = req.body
            const users = await User.find()
            if (!users) return res.status(404).json({
                sucess: false,
                message: "No nft found."
            })
            res.status(200).json({
                sucess: false,
                message: users
            })
        } catch (error) {
            res.status(409).json({ error: error.message })
        }
    }