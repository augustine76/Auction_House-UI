import { User } from "../model/users.js"
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
            existingUser.isSigned = true;
            existingUser.save();
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



export const getUserDetails = async (req, res) => {
        // console.log(req)
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
    