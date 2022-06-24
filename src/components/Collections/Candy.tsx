import { Metaplex, keypairIdentity, bundlrStorage } from "@metaplex-foundation/js";
import { Connection, clusterApiUrl,  PublicKey } from "@solana/web3.js";
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button, Grid, Loading } from "@nextui-org/react";
import { useState } from "react";


export const Candy = () => {
    let arr = [];
    const [list, setList] = useState([]);
    const click = () => {
        console.log(
            'inside click'
        )
     
        list.map(x => 
         <li>{x}</li>    
        )
    }
    const [arrLoaded, setarrLoaded] = useState(false);

    async function findCandyMachine() {
        let candyMachineAddress = "3TZjtRtDsud17eLveiXFcwhE7DnkmY6r8ogh2rimgNiL";
        
        console.log("Inside candy");
    
  
        const connection = new Connection(clusterApiUrl("devnet"));
        const wallet = useWallet();
        const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(wallet))
        .use(bundlrStorage());
        
        const UltimateCandyMachine = new PublicKey('cndy3Z4yapfJBmL3ShUp5exZKqR3z33thTzeNMm2gRZ');
    
        const { publicKey } =  useWallet();
        const provider = new anchor.AnchorProvider(connection,wallet);
        // console.log(await publicKey.toBase58(), "pubkey in candy");
        const idl = await anchor.Program.fetchIdl(UltimateCandyMachine,provider,);
        const program = new anchor.Program(idl,UltimateCandyMachine,provider,);
    
        const candy = await program.account.candyMachine.fetch(candyMachineAddress)
        console.log(await candy.authority.toBase58(), "Authority");
       
    
        if(await candy.authority.toBase58() == publicKey){
            
            const nfts = await metaplex.nfts().findAllByCandyMachine(await new PublicKey(candyMachineAddress));
    
            console.log(nfts);
    
            nfts.map(x => {
                arr.push(x.mint.toBase58());
            })
    
            console.log("arr is" ,arr);
            setList(arr);
            setarrLoaded(true);
            
    
        }
        else {
            console.log("wallet address is not the authority of given candy machine")
        }
      }
      findCandyMachine();
    return(
    <Grid.Container gap={2}>
        <Grid>
        {
            arrLoaded ?       
            <div>    
                <button
                className="btn btn-primary"
                type="submit"
                >
                Loaded NFT List
                </button>
                
            </div>
          :
          <Button disabled auto bordered color="success" css={{ px: "$13" }}>
          <Loading type="points" color="currentColor" size="sm" />
        </Button>

        }

        <button onClick={click}>
            Show List
        </button>

         </Grid>
        </Grid.Container>
    )
}