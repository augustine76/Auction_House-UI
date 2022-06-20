import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("mainnet-beta"));
const wallet = Keypair.generate();

const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());

const hi = async () => {
const pk = new PublicKey('4L3oWp4ANModX1TspSSetKsB8HUu2TiBpuqj5FGJonAh')
const nfts = await metaplex.nfts().findAllByCreator(pk, 1);
console.log(nfts);
}

hi();