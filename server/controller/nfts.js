import { NFTS } from "../model/nfts.js";
export const listNFT = async (req, res) => {
    try {

        const { owner, mintKey, priceAmount } = req.body

        const findMintKey = await NFTS.findOne({
            mintKey
        })

        if (!findMintKey) {

            try {
                const newNft = new NFTS({
                    mintKey, owner, priceAmount
                })
                newNft.save(async (_, nft) => {
                    return res.status(201).json(nft);
                })
            }
            catch (error) {
                return res.status(400).json({ message: error.message })
            }

        }
        else {
            return res.status(404).json({
                success: false,
                message: "NFT is already listed"
            })
        }
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }
}



export const getNFTDetails = async (req, res) => {
    // console.log(req)
    try {

        var mintKey = req.params.mint;
        const nft = await NFTS.findOne({
            mintKey
        })
        if (nft) {
            return res.status(201).json({
                success: true,
                data: nft,
                message: "nft Details fetched"
            })
        } else return res.status(404).json({
            success: false,
            message: "nft not found."
        })
    } catch (error) {
        return res.status(409).json({ error: error.message })
    }

}