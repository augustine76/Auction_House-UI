import { NFTS } from "../model/nfts.js";
import { Collection } from "../model/collection.js";
import { User } from "../model/users.js";
export const listNFT = async (req, res) => {
    try {

        const { owner, mintKey, priceAmount } = req.body

        const Nft = await NFTS.findOne({
            mintKey
        })
        console.log(Nft)
        const nftCollection = Nft.collectionName

        const collection = await Collection.findOne({
            name: nftCollection
        })

        if (Nft && collection) {
            try {

                Nft.inSale = true;
                Nft.priceAmount = priceAmount;
                Nft.owner = owner;
                Nft.save();
                if (collection.floorPrice == 0) {
                    collection.floorPrice = priceAmount;

                }   
                if (priceAmount < collection.floorPrice) {
                    collection.floorPrice = priceAmount;
                }
                collection.totalListedNfts = collection.totalListedNfts + 1;

                const activity = {
                    mintKey: mintKey,
                    type: 'listed',
                    seller: owner,
                    priceAmount: priceAmount,
                }

                await collection.activity.push(activity);
                await collection.save();

                const user = await User.findOne({ publicKey: owner })
                user.activity.push(activity);
                await user.save();

                return res.status(201).json({ message: "Nft is listed ", data: collection })
            } catch (error) {
                return res.status(400).json({ message: error.message })
            }


        }
        else {
            return res.status(404).json({
                success: false,
                message: "NFT is not part of any collection or collection does not exits"
            })
        }
    }
    catch (error) {
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

export const listedNFTS = async (req, res) => {
    try {
        const { owner } = req.body
        console.log("owner", owner);

        if (owner) {
            const nft = await NFTS.find({
                owner, inSale: true
            })
            if (nft) {

                return res.status(200).json({
                    status: 1,
                    data: nft,
                    message: "This NFT is Listed"
                })


            }
            else {
                return res.status(200).json({
                    status: 0,
                    message: "No NFT is not Listed"
                })
            }

        }
        else return res.status(404).json({
            success: false,
            message: "owner not found."
        })
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export const isListed = async (req, res) => {
    try {
        // const mintKey  = req.query.mintKey;
        // console.log("mint", mintKey);
        const { mintKey } = req.body
        if (mintKey) {
            const nft = await NFTS.findOne({
                mintKey: mintKey
            })
            if (nft) {
                if (nft.inSale == true) {
                    res.status(200).json({
                        status: 1,
                        data: nft,
                        message: "This NFT is Listed"
                    })
                }

            }
            else {
                res.status(200).json({
                    status: 0,
                    message: "This NFT is not found"
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

// //collections:- nfts owned
export const fetchAllUserOwnedNfts = async (req, res) => {
    try {
        const { publicKey } = req.body
        const user = await User.findOne({
            publicKey
        })
        if (user) {
            const nft = await NFTS.find({
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

// It after clicking on a particular collection it fetches its details as well
// As all the listed nfts of that particular collection
export const FetchListedNftsOfCollection = async (req, res) => {

    const name = req.params.name
    console.log(name)
    const collection = await Collection.findOne({ name })

    if (collection == undefined) {
        return res.status(400).json(`collection name ${name} does not exist`);
    }

    const nfts = JSON.parse(collection.nfts);
    const length = nfts.length
    // console.log("nft",nfts)
    let listedNfts = [];
    let i;
    for (i = 0; i < length; i++) {
        const nft = await NFTS.findOne({ mintKey: nfts[i], inSale: true })
        console.log(nft)
        if (!(nft == null)) {

            listedNfts.push(nft);
        }
    }
    if (listedNfts == []) {
        return res.status(200).send("There are No Nfts listed from this collection at the moment ");
    }

    return res.status(200).json(
        {
            success: true,
            message: "Listed Nfts fetched",
            data: listedNfts
        });
}

//1st API Collections owned by the address
//2nd API NFTs owned by the address in those Collections


export const FetchListedOwnedNFTsInCollection = async (req, res) => {

    const { owner, collectionName } = req.body;
  


    const NFTs = await NFTS.find({ owner: owner, collectionName: collectionName });

    if (NFTs == undefined) {
        return res.status(400).json(`NFT doesn't exist in this collection ${collectionName} for this owner ${owner}`);
    }

    let listedNFTs = [];
    for (let i = 0; i < NFTs.length; i++) {
        console.log("NFTS", NFTs[i]);
        if (NFTs[i].inSale == true) {
            listedNFTs.push(NFTs[i]);
        }
    }
    // console.log("listedNFTs", listedNFTs);

    if (listedNFTs == []) {
        return res.status(200).send("There are No Nfts listed from this collection at the moment ");
    }

    return res.send(listedNFTs);
}


export const FetchOwnedNFTsInCollection = async (req, res) => {

    const { owner, collectionName } = req.body;
    console.log(owner, collectionName);


    const NFTs = await NFTS.find({ owner: owner, collectionName: collectionName });

    if (NFTs == undefined) {
        return res.status(400).json(`NFT doesn't exist in this collection ${collectionName} for this owner ${owner}`);
    }

    let ownedNFTs = [];
    for (let i = 0; i < NFTs.length; i++) {
        console.log("NFTS", NFTs[i]);
        if (NFTs[i].inSale == false) {
            ownedNFTs.push(NFTs[i]);
        }
    }


    if (ownedNFTs == []) {
        return res.status(200).send("There are No Nfts listed from this collection at the moment ");
    }

    return res.send(ownedNFTs);
}

export const buyNft = async (req, res) => {
    try {

        const { mintKey, owner, buyer } = req.body
        if (mintKey) {
            const nft = await NFTS.findOne({
                mintKey: mintKey,
                owner: owner
            })
            if (nft) {
                if (nft.inSale == true) {
                    nft.inSale = false
                    nft.owner = buyer
                    nft.priceAmount=0;
                    const priceAmount = nft.priceAmount;
                    const collectionName = nft.collectionName
                    const collection = await Collection.findOne({ name: collectionName })
                    let totalListedNfts = collection.totalListedNfts;

                    const owners = await Collection.findOne({ owners: buyer })
                    const nfts = await NFTS.find({ owner, collectionName });


                    const buyerActivity = {
                        mintKey: mintKey,
                        type: 'buy',
                        buyer: buyer,
                        seller: owner,
                        priceAmount: priceAmount,
                    }

                    const buyer2 = await User.findOne({ publicKey: buyer })
                    buyer2.activity.push(buyerActivity);

                    const sellerActivity = {
                        mintKey: mintKey,
                        type: 'sell',
                        buyer: buyer,
                        seller: owner,
                        priceAmount: priceAmount,
                    }

                    const collectionActivity = {
                        mintKey: mintKey,
                        type: 'sale',
                        buyer: buyer,
                        seller: owner,
                        priceAmount: priceAmount,
                    }

                    const seller = await User.findOne({ publicKey: owner })
                    seller.activity.push(sellerActivity);
                    if (nfts.length <= 1) {
                        collection.owners = await collection.owners.filter(publicKey => publicKey != owner);

                    }
                    if (!owners) {
                        await collection.owners.push(buyer);
                    }

                    collection.totalUniqueHolders = collection.owners.length
                    collection.totalListedNfts = --totalListedNfts;
                    collection.tradingVolume += nft.priceAmount;


                    await collection.activity.push(collectionActivity);
                    await collection.save();
                    await nft.save();
                    await seller.save();
                    await buyer2.save();
                    res.status(200).json({
                        status: 1,
                        data: nft, collection,
                        message: "This NFT is sold"
                    })
                }
                else {
                    res.status(200).json({

                        message: "This NFT is notListed"
                    })
                }

            }
            else {
                res.status(200).json({
                    status: 0,
                    message: "This NFT is not found"
                })
            }

        }
        else return res.status(404).json({
            success: false,
            message: "Nft is not found"
        })
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export const cancelNFTListing = async (req, res) => {
    try {

        const { mintKey, owner } = req.body
        if (mintKey) {
            const nft = await NFTS.findOne({
                mintKey: mintKey,
                owner: owner
            })
            if (nft) {
                if (nft.inSale == true) {
                    nft.inSale = false
                    const priceAmount=nft.priceAmount
                    const collectionName = nft.collectionName
                    const collection = await Collection.findOne({ name: collectionName })
                    console.log(collection);

                    const activity = {
                        mintKey: mintKey,
                        type: 'cancelListing',
                        
                        seller: owner,
                        priceAmount: priceAmount,
                    }

                    const user = await User.findOne({ publicKey: owner })
                    user.activity.push(activity);


                    let totalListedNfts = collection.totalListedNfts;
                    collection.totalListedNfts = totalListedNfts - 1;
                    await collection.activity.push(activity);
                    await nft.save();
                    await collection.save();

                    await user.save();

                    res.status(200).json({
                        status: 1,
                        data: nft, collection,
                        message: "This NFT is cancel for listing"
                    })
                }
                else {
                    res.status(200).json({

                        message: "This NFT is notListed"
                    })
                }

            }
            else {
                res.status(200).json({
                    status: 0,
                    message: "This NFT is not found"
                })
            }

        }
        else return res.status(404).json({
            success: false,
            message: "Nft is not found"
        })
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}
