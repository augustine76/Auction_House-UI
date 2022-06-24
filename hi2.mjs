import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl,  PublicKey } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';


export async function findCandyMachine(candyMachineAddress) {
  
    const connection = new Connection(clusterApiUrl("devnet"));
    const wallet = useWallet();
    const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet))
    .use(bundlrStorage());
    
    const UltimateCandyMachine = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');

    const { publicKey } =  useWallet();
    const provider = new anchor.AnchorProvider(connection,wallet);
    
    const idl = await anchor.Program.fetchIdl(UltimateCandyMachine,provider,);
    const program = new anchor.Program(idl,candyMachine,provider,);

    const candy = await program.account.candyMachine.fetch(candyMachineAddress)
    console.log(await candy.authority.toBase58());
   

    if(await candy.authority.toBase58() == publicKey){
        
        const nfts = await metaplex.nfts().findAllByCandyMachine(candyMachineAddress);

        console.log(nfts);
        let arr = [];

        nfts.map(x => {
            arr.push(x.mint.toBase58());
        })

        console.log("arr is" ,arr);

    }
    else {
        console.log("wallet address is not the authority of given candy machine")
    }
  }

findCandyMachine();