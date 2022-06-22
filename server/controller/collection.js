
import { Collection } from "../model/collection.js";
import { NFTS } from "../model/nfts.js";

// To Add a new collection of nfts

export const addCollection = async(req,res) => {

    const name = req.body.name;
    const symbol = req.body.symbol;
    const description = req.body.description;
    const nfts = req.body.hash;
    const image = req.body.image;
    const creator = req.body.creator;

    const existingCollection = Collection.findOne({ name :name });

    if(existingCollection == undefined){
        return res.status(409).json("collection already exists");
    }

    if(!nfts) {
        return res.status(402).json("Given hash file is empty or not readable");
    }

    const collection = new Collection({
        name : name,
        symbol : symbol,
        description : description,
        nfts : nfts,
        image : image,
        creator : creator
    })

   const newCollection =  await collection.save();

    return res.status(201).json({message:"New collection Added",collection: newCollection})

}

// fetches all nft and details of the collection , 
// Used in collection page when we want to view a particular collection
export const fetchCollection = async(req,res) => {

    const name = req.body.name

    const collection = await Collection.findOne({name})

    if(collection == undefined) {
       return  res.status(400).json(`collection name ${name} does not exist`);
    }

    res.send(collection);
}

//Fetches all collection with all details
// we only need Names and images, 
// after clicking on collection we can use fetch collection method
export const fetchAllCollection = async(req,res) => {

    const collection =await Collection.find();

    if(collection == undefined) {
        return res.status(401).json("No collection at the moment to fetch");
    }

    return res.send(collection);

}


/// BETA



// It after clicking on a particular collection it fetches its details as well
// As all the listed nfts of that particular collection
export const FetchListedNftsOfCollection = async(req,res) => {
   
    const name = req.params.name
    console.log(name)
    const collection = await Collection.findOne({name})

    if(collection == undefined) {
       return  res.status(400).json(`collection name ${name} does not exist`);
    }
    
    // const nfts = JSON.parse(collection.nfts);
    const nfts=collection.nfts;
    const length = nfts.length
    // console.log("nft",nfts)
    let listedNfts = [];
    let i;
    for(i=0; i<length;i++){
        const nft = await NFTS.findOne({mintKey : nfts[i],inSale:true})
        console.log(nft)
        if(!(nft == null)){
            
            listedNfts.push(nft);
        }
    }
    if(listedNfts == []){
       return  res.status(200).send("There are No Nfts listed from this collection at the moment ");
    }
    
    return res.status(200).json(
        {
            success: true,
            message: "Listed Nfts fetched",
            data:listedNfts
        });
}
