import { Metaplex, keypairIdentity, bundlrStorage, getAccountParsingFunction } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';

const key = [44,80,110,168,241,72,188,70,186,15,184,164,32,186,13,169,109,108,210,135,0,192,212,28,184,189,249,70,200,207,145,214,121,9,26,120,244,6,184,248,47,119,162,80,71,33,84,211,186,119,123,175,102,195,227,196,174,169,18,216,86,182,57,92]
export async function findCandyMachine(
  ) {
  
    const solConnection = new Connection(clusterApiUrl("devnet"));
    
    const candyMachine = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
    const pk = new PublicKey('3TZjtRtDsud17eLveiXFcwhE7DnkmY6r8ogh2rimgNiL')
    const wallet = new anchor.Wallet(key);
    const provider = new anchor.AnchorProvider(solConnection,key);
    
    const idl = await anchor.Program.fetchIdl(
        candyMachine,
      provider,
    );
    const program = new anchor.Program(idl,candyMachine,provider,);

    const candy = await program.account.candyMachine.fetch(pk)
    console.log(await candy.authority.toBase58());

    async function hi() {
        const pk = new PublicKey('3TZjtRtDsud17eLveiXFcwhE7DnkmY6r8ogh2rimgNiL')
        const nfts = await metaplex.nfts().findAllByCandyMachine(pk);
        // console.log(nfts[0].mint.toBase58());

        let arr = [];

        nfts.map(x => {
            arr.push(x.mint.toBase58());
        })

        console.log("arr is" ,arr);
    }
    hi();
  }



const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.generate();





const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());


findCandyMachine();