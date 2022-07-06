// @ts-nocheck
import log from 'loglevel';
import {
  deserializeAccount,
  getAtaForMint,
  getAuctionHouse,
  getAuctionHouseBuyerEscrow,
  getAuctionHouseFeeAcct,
  getAuctionHouseProgramAsSigner,
  getAuctionHouseTradeState,
  getAuctionHouseTreasuryAcct,
  getMetadata,
  getTokenAmount,
  loadAuctionHouseProgram,
  loadWalletKey,
} from './helpers/accounts';
import { BN, web3 } from '@project-serum/anchor';
import {
  TOKEN_PROGRAM_ID,
  WRAPPED_SOL_MINT,
} from './helpers/constants';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token';
import { getPriceWithMantissa } from './helpers/various';
import { sendTransactionWithRetryWithKeypair } from './helpers/transactions';
import { decodeMetadata, Metadata } from './helpers/schema';
import { Keypair } from '@solana/web3.js';


export async function getAuctionHouseFromOpts(
  auctionHouse: any,
  walletKeyPair: any,
  tMintKey: any,
) {
  let auctionHouseKey;
  if (auctionHouse) {
    auctionHouseKey = new web3.PublicKey(auctionHouse);
  } else {
    console.log(
      'No auction house explicitly passed in, assuming you are creator on it and deriving key...',
    );
    auctionHouseKey = (
      await getAuctionHouse(walletKeyPair.publicKey, tMintKey)
    )[0];
  }
  return auctionHouseKey;
}


export const show_escrow = async (cmd : any ) => { 
    const { keypair, env, auctionHouse, wallet } = cmd;

    const otherWallet = wallet ? new web3.PublicKey(wallet) : null;
    const walletKeyPair = loadWalletKey(keypair);
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);

    const auctionHouseKey = new web3.PublicKey(auctionHouse);
    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );

    if (!otherWallet) {
      console.log('No --wallet passed in, defaulting to keypair');
    }
    const escrow = (
      await getAuctionHouseBuyerEscrow(
        auctionHouseKey,
        otherWallet || walletKeyPair.publicKey,
      )
    )[0];

    const amount = await getTokenAmount(
      anchorProgram,
      escrow,

      auctionHouseObj.treasuryMint,
    );

  };

export const withdraw = async (cmd : any) => {
    const { wallet, env, amount, auctionHouse, auctionHouseKeypair } =
      cmd;
    const auctionHouseKey = new web3.PublicKey(auctionHouse);
    const walletKeyPair = wallet;
    const auctionHouseKeypairLoaded = auctionHouseKeypair
      ? loadWalletKey(auctionHouseKeypair)
      : null;
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);
    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );
    const amountAdjusted = await getPriceWithMantissa(
      amount,

      auctionHouseObj.treasuryMint,
      walletKeyPair,
      anchorProgram,
    );

    const [escrowPaymentAccount, bump] = await getAuctionHouseBuyerEscrow(
      auctionHouseKey,
      walletKeyPair.publicKey,
    );

    const isNative = auctionHouseObj.treasuryMint.equals(WRAPPED_SOL_MINT);

    const ata = (
      await getAtaForMint(
   
        auctionHouseObj.treasuryMint,
        walletKeyPair.publicKey,
      )
    )[0];
    const signers : Keypair[] = [];

    const currBal = await getTokenAmount(
      anchorProgram,
      escrowPaymentAccount,
  
      auctionHouseObj.treasuryMint,
    );

    const instruction = await anchorProgram.instruction.withdraw(
      bump,
      new BN(amountAdjusted),
      {
        accounts: {
          wallet: walletKeyPair.publicKey,
          receiptAccount: isNative ? walletKeyPair.publicKey : ata,
          escrowPaymentAccount,
          treasuryMint: auctionHouseObj.treasuryMint,
          authority: auctionHouseObj.authority,
          auctionHouse: auctionHouseKey,
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
          ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
        signers,
      },
    );

    if (auctionHouseKeypairLoaded) {
      signers.push(auctionHouseKeypairLoaded);

      instruction.keys
        .filter(k => k.pubkey.equals(auctionHouseKeypairLoaded.publicKey))
        .map(k => (k.isSigner = true));
    }

    instruction.keys
      .filter(k => k.pubkey.equals(walletKeyPair.publicKey))
      .map(k => (k.isSigner = true));

    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      walletKeyPair,
      [instruction],
      signers,
      'max',
    );

    console.log(
      'Withdrew',
      amountAdjusted,
      'from your account with Auction House',
      auctionHouse,
      '. New Balance:',
      currBal - amountAdjusted,
    );
    var output = {  
      'amount': amountAdjusted,
    'account':auctionHouse,
    'balance':currBal - amountAdjusted}
    return output
  };

export const sell = async (cmd : any) => {
    console.log("inside sell 1");
    const {
      wallet,
      env,
      auctionHouse,
      auctionHouseKeypair,
      buyPrice,
      mint,
      tokenSize,
      auctionHouseSigns,
    } = cmd;
    console.log("inside sell 2");

    const auctionHouseKey = new web3.PublicKey(auctionHouse);
    const walletKeyPair = wallet;
    console.log("inside sell 3");

    const mintKey = new web3.PublicKey(mint);
    console.log("inside sell 4");


    const auctionHouseKeypairLoaded = auctionHouseKeypair
      ? loadWalletKey(auctionHouseKeypair)
      : null as any;;

    console.log("inside sell 5");

    const anchorProgram = await loadAuctionHouseProgram(
      auctionHouseSigns ? auctionHouseKeypairLoaded : walletKeyPair,
      env,
    );

    console.log("inside sell 6");

    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );
    console.log("inside sell 7");

    const buyPriceAdjusted = new BN(
      await getPriceWithMantissa(
        buyPrice,
        auctionHouseObj.treasuryMint,
        walletKeyPair,
        anchorProgram,
      ),
    );
    console.log("inside sell 8");

    const tokenSizeAdjusted = new BN(
      await getPriceWithMantissa(
        tokenSize,
        mintKey,
        walletKeyPair,
        anchorProgram,
      ),
    );
    console.log("inside sell 9");

    const tokenAccountKey = (
      await getAtaForMint(mintKey, walletKeyPair.publicKey)
    )[0];
    console.log("inside sell 10");

    const [programAsSigner, programAsSignerBump] =
      await getAuctionHouseProgramAsSigner();
   
      console.log("inside sell 11");

    const [tradeState, tradeBump] = await getAuctionHouseTradeState(
      auctionHouseKey,
      walletKeyPair.publicKey,
      tokenAccountKey,
      auctionHouseObj.treasuryMint,
      mintKey,
      tokenSizeAdjusted,
      buyPriceAdjusted,
    );
    console.log("inside sel 12l");

    const [freeTradeState, freeTradeBump] = await getAuctionHouseTradeState(
      auctionHouseKey,
      walletKeyPair.publicKey,
      tokenAccountKey,
      auctionHouseObj.treasuryMint,
      mintKey,
      tokenSizeAdjusted,
      new BN(0),
    );
    console.log("inside sell 13");
      
    const signers : Keypair[] = [];
    console.log("here done")
    const instruction = await anchorProgram.instruction.sell(
      tradeBump,
      freeTradeBump,
      programAsSignerBump,
      buyPriceAdjusted,
      tokenSizeAdjusted,
      {
        accounts: {
          wallet: walletKeyPair.publicKey,
          metadata: await getMetadata(mintKey),
          tokenAccount: tokenAccountKey,
          authority: auctionHouseObj.authority,
          auctionHouse: auctionHouseKey,
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          sellerTradeState: tradeState,
          freeSellerTradeState: freeTradeState,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          programAsSigner,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers,
      },
    );
      console.log("here2")
    if (auctionHouseKeypairLoaded) {
      signers.push(auctionHouseKeypairLoaded);

      instruction.keys
        .filter(k => k.pubkey.equals(auctionHouseKeypairLoaded.publicKey))
        .map(k => (k.isSigner = true));
    }
    console.log("here3")
    if (!auctionHouseSigns) {
      instruction.keys
        .filter(k => k.pubkey.equals(walletKeyPair.publicKey))
        .map(k => (k.isSigner = true));
    }
    console.log("here4")
    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      auctionHouseSigns ? auctionHouseKeypairLoaded : walletKeyPair,
      [instruction],
      signers,
      'max',
    );
    console.log("here5")
    console.log(
      'Set',
      tokenSize,
      mint,
      'for sale for',
      buyPrice,
      'from your account with Auction House',
      auctionHouse,
    );
    var output = {
      'mintAddress': mint,
    'price': buyPrice,
    'account':auctionHouse}
    return output
  };

export const withdraw_from_treasury = async (cmd : any) => {
    const { keypair, env, auctionHouse, treasuryMint, amount } = cmd;

    const walletKeyPair = loadWalletKey(keypair);

    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);

    let tMintKey;
    if (!treasuryMint) {
      console.log('No treasury mint detected, using SOL.');
      tMintKey = WRAPPED_SOL_MINT;
    } else {
      tMintKey = new web3.PublicKey(treasuryMint);
    }

    const auctionHouseKey = await getAuctionHouseFromOpts(
      auctionHouse,
      walletKeyPair,
      tMintKey,
    );

    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );

    const amountAdjusted = new BN(
      await getPriceWithMantissa(
        amount,
    
        auctionHouseObj.treasuryMint,
        walletKeyPair,
        anchorProgram,
      ),
    );
    const signers : Keypair[] = [];

    const instruction = await anchorProgram.instruction.withdrawFromTreasury(
      amountAdjusted,
      {
        accounts: {
          treasuryMint: auctionHouseObj.treasuryMint,
          authority: auctionHouseObj.authority,
          treasuryWithdrawalDestination:
            auctionHouseObj.treasuryWithdrawalDestination,
          auctionHouseTreasury: auctionHouseObj.auctionHouseTreasury,
          auctionHouse: auctionHouseKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
        },
        signers,
      },
    );

    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      walletKeyPair,
      [instruction],
      signers,
      'max',
    );

    console.log(
      'Withdrew',
      amountAdjusted.toNumber(),
      'from your account with Auction House',
      auctionHouse,
    );
  };

  export const withdraw_from_fees = async (cmd : any) => {
    const { keypair, env, auctionHouse, treasuryMint, amount } = cmd;

    const walletKeyPair = loadWalletKey(keypair);

    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);

    let tMintKey;
    if (!treasuryMint) {
      console.log('No treasury mint detected, using SOL.');
      tMintKey = WRAPPED_SOL_MINT;
    } else {
      tMintKey = new web3.PublicKey(treasuryMint);
    }

    const auctionHouseKey = await getAuctionHouseFromOpts(
      auctionHouse,
      walletKeyPair,
      tMintKey,
    );

    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );

    const amountAdjusted = new BN(
      await getPriceWithMantissa(
        amount,
        auctionHouseObj.treasuryMint,
        walletKeyPair,
        anchorProgram,
      ),
    );
    const signers : Keypair[] = [];

    const instruction = await anchorProgram.instruction.withdrawFromFee(
      amountAdjusted,
      {
        accounts: {
          authority: auctionHouseObj.authority,
          feeWithdrawalDestination:
            auctionHouseObj.feeWithdrawalDestination,
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          auctionHouse: auctionHouseKey,
          systemProgram: web3.SystemProgram.programId,
        },
        signers,
      },
    );

    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      walletKeyPair,
      [instruction],
      signers,
      'max',
    );

    console.log(
      'Withdrew',
      amountAdjusted.toNumber(),
      'from your account with Auction House',
      auctionHouse,
    );
  };

export const cancel = async (cmd : any) => {
    const {
      wallet,
      env,
      auctionHouse,
      auctionHouseKeypair,
      buyPrice,
      mint,
      tokenSize,
      auctionHouseSigns,
    } = cmd;

    const auctionHouseKey = new web3.PublicKey(auctionHouse);
    const walletKeyPair = wallet;

    const mintKey = new web3.PublicKey(mint);

    const auctionHouseKeypairLoaded = auctionHouseKeypair
      ? loadWalletKey(auctionHouseKeypair)
      : null as any;
    const anchorProgram = await loadAuctionHouseProgram(
      auctionHouseSigns ? auctionHouseKeypairLoaded : walletKeyPair,
      env,
    );
    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );

    const buyPriceAdjusted = new BN(
      await getPriceWithMantissa(
        buyPrice,
        auctionHouseObj.treasuryMint,
        walletKeyPair,
        anchorProgram,
      ),
    );

    const tokenSizeAdjusted = new BN(
      await getPriceWithMantissa(
        tokenSize,
        mintKey,
        walletKeyPair,
        anchorProgram,
      ),
    );

    const tokenAccountKey = (
      await getAtaForMint(mintKey, walletKeyPair.publicKey)
    )[0];

    const tradeState = (
      await getAuctionHouseTradeState(
        auctionHouseKey,
        walletKeyPair.publicKey,
        tokenAccountKey,
        auctionHouseObj.treasuryMint,
        mintKey,
        tokenSizeAdjusted,
        buyPriceAdjusted,
      )
    )[0];

    const signers : Keypair[] = [];

    const instruction = await anchorProgram.instruction.cancel(
      buyPriceAdjusted,
      tokenSizeAdjusted,
      {
        accounts: {
          wallet: walletKeyPair.publicKey,
          tokenAccount: tokenAccountKey,
          tokenMint: mintKey,
          authority: auctionHouseObj.authority,
          auctionHouse: auctionHouseKey,
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          tradeState,
          tokenProgram: TOKEN_PROGRAM_ID,
        },
        signers,
      },
    );

    if (auctionHouseKeypairLoaded) {
      signers.push(auctionHouseKeypairLoaded);

      instruction.keys
        .filter(k => k.pubkey.equals(auctionHouseKeypairLoaded.publicKey))
        .map(k => (k.isSigner = true));
    }

    if (!auctionHouseSigns) {
      instruction.keys
        .filter(k => k.pubkey.equals(walletKeyPair.publicKey))
        .map(k => (k.isSigner = true));
    }

    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      auctionHouseSigns ? auctionHouseKeypairLoaded : walletKeyPair,
      [instruction],
      signers,
      'max',
    );

    console.log(
      'Cancelled buy or sale of',
      tokenSize,
      mint,
      'for',
      buyPrice,
      'from your account with Auction House',
      auctionHouse,
    );
  };


export const buy = async (cmd : any ) => {
    const {
      wallet,
      env,
      auctionHouse,
      auctionHouseKeypair,
      buyPrice,
      mint,
      tokenSize,
      tokenAccount,
      auctionHouseSigns,
      sellerWallet,
    } = cmd;

    const auctionHouseKey = new web3.PublicKey(auctionHouse);
    const walletKeyPair = wallet;

    const mintKey = new web3.PublicKey(mint);

    const auctionHouseKeypairLoaded = auctionHouseKeypair
      ? loadWalletKey(auctionHouseKeypair)
      : null as any;
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);
    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );

    const buyPriceAdjusted = new BN(
      await getPriceWithMantissa(
        buyPrice,
        auctionHouseObj.treasuryMint,
        walletKeyPair,
        anchorProgram,
      ),
    );

    const tokenSizeAdjusted = new BN(
      await getPriceWithMantissa(
        tokenSize,
        mintKey,
        walletKeyPair,
        anchorProgram,
      ),
    );

    const [escrowPaymentAccount, escrowBump] = await getAuctionHouseBuyerEscrow(
      auctionHouseKey,
      walletKeyPair.publicKey,
    );

    const results =
      await anchorProgram.provider.connection.getTokenLargestAccounts(mintKey);

    const tokenAccountKey: web3.PublicKey = tokenAccount
      ? new web3.PublicKey(tokenAccount)
      : results.value[0].address;

    const [tradeState, tradeBump] = await getAuctionHouseTradeState(
      auctionHouseKey,
      walletKeyPair.publicKey,
      tokenAccountKey,
      auctionHouseObj.treasuryMint,
      mintKey,
      tokenSizeAdjusted,
      buyPriceAdjusted,
    );

 
    const isNative = auctionHouseObj.treasuryMint.equals(WRAPPED_SOL_MINT);

    const ata = (
      await getAtaForMint(
 
        auctionHouseObj.treasuryMint,
        walletKeyPair.publicKey,
      )
    )[0];
    const transferAuthority = web3.Keypair.generate();
    const signers = isNative ? [] : [transferAuthority];
    const instruction = await anchorProgram.instruction.buy(
      tradeBump,
      escrowBump,
      buyPriceAdjusted,
      tokenSizeAdjusted,
      {
        accounts: {
          wallet: walletKeyPair.publicKey,
          paymentAccount: isNative ? walletKeyPair.publicKey : ata,
          transferAuthority: isNative
            ? web3.SystemProgram.programId
            : transferAuthority.publicKey,
          metadata: await getMetadata(mintKey),
          tokenAccount: tokenAccountKey,
          escrowPaymentAccount,
          treasuryMint: auctionHouseObj.treasuryMint,
          authority: auctionHouseObj.authority,
          auctionHouse: auctionHouseKey,
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          buyerTradeState: tradeState,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      },
    );

    if (auctionHouseKeypairLoaded) {
      signers.push(auctionHouseKeypairLoaded);

      instruction.keys
        .filter(k => k.pubkey.equals(auctionHouseKeypairLoaded.publicKey))
        .map(k => (k.isSigner = true));
    }

    if (!isNative) {
      instruction.keys
        .filter(k => k.pubkey.equals(transferAuthority.publicKey))
        .map(k => (k.isSigner = true));
    }

    const instructions = [
      ...(isNative
        ? []
        : [
            Token.createApproveInstruction(
              TOKEN_PROGRAM_ID,
              ata,
              transferAuthority.publicKey,
              walletKeyPair.publicKey,
              [],
              buyPriceAdjusted.toNumber(),
            ),
          ]),

      instruction,
      ...(isNative
        ? []
        : [
            Token.createRevokeInstruction(
              TOKEN_PROGRAM_ID,
              ata,
              walletKeyPair.publicKey,
              [],
            ),
          ]),
    ];
    // await sendTransactionWithRetryWithKeypair(
    //   anchorProgram.provider.connection,
    //   walletKeyPair,
    //   instructions,
    //   signers,
    //   'max',
    // );

  //Sale Execution

    const sellerWalletKey = new web3.PublicKey(sellerWallet);

    const tokenAccountKeyforSale = (await getAtaForMint(mintKey, sellerWalletKey))[0];

    const buyerTradeState = (
      await getAuctionHouseTradeState(
        auctionHouseKey,
        walletKeyPair.publicKey,
        tokenAccountKeyforSale,
        auctionHouseObj.treasuryMint,
        mintKey,
        tokenSizeAdjusted,
        buyPriceAdjusted,
      )
    )[0];

    const sellerTradeState = (
      await getAuctionHouseTradeState(
        auctionHouseKey,
        sellerWalletKey,
        tokenAccountKeyforSale,
        auctionHouseObj.treasuryMint,
        mintKey,
        tokenSizeAdjusted,
        buyPriceAdjusted,
      )
    )[0];

    const [freeTradeState, freeTradeStateBump] =
      await getAuctionHouseTradeState(
        auctionHouseKey,
        sellerWalletKey,
        tokenAccountKeyforSale,
        auctionHouseObj.treasuryMint,
        mintKey,
        tokenSizeAdjusted,
        new BN(0),
      );
    const [escrowPaymentAccountSale, bump] = await getAuctionHouseBuyerEscrow(
      auctionHouseKey,
      walletKeyPair.publicKey,
    );
    const [programAsSigner, programAsSignerBump] =
      await getAuctionHouseProgramAsSigner();
    const metadata = await getMetadata(mintKey);
    const metadataObj = await anchorProgram.provider.connection.getAccountInfo(
      metadata,sellerWallet
    ) ;
    const metadataDecoded: Metadata = decodeMetadata(
      Buffer.from(metadataObj!.data),
    ) ;

    const remainingAccounts = [];

    for (let i = 0; i < metadataDecoded!.data!.creators!.length; i++) {
      var a = new web3.PublicKey(metadataDecoded.data.creators[i].address)
      remainingAccounts.push({
        pubkey: a,
        isWritable: true,

        isSigner: false,
      });
      if (!isNative) {
        remainingAccounts.push({
          pubkey: (
            await getAtaForMint(
              auctionHouseObj.treasuryMint,
              remainingAccounts[remainingAccounts.length - 1].pubkey,
            )
          )[0],
          isWritable: true,
          isSigner: false,
        });
      }
    }
    const signersforSale : Keypair[] = [];

    const tMint: web3.PublicKey = auctionHouseObj.treasuryMint;

    const instruction0 = await anchorProgram.instruction.executeSale(
      bump,
      freeTradeStateBump,
      programAsSignerBump,
      buyPriceAdjusted,
      tokenSizeAdjusted,
      {
        accounts: {
          buyer: walletKeyPair.publicKey,
          seller: sellerWalletKey,
          metadata,
          tokenAccount: tokenAccountKeyforSale,
          tokenMint: mintKey,
          escrowPaymentAccount,
          treasuryMint: tMint,
          sellerPaymentReceiptAccount: isNative
            ? sellerWalletKey
            : (
                await getAtaForMint(tMint, sellerWalletKey)
              )[0],
          buyerReceiptTokenAccount: (
            await getAtaForMint(mintKey, walletKeyPair.publicKey)
          )[0],
          //@ts-ignore
          authority: auctionHouseObj.authority,
          auctionHouse: auctionHouseKey,
          //@ts-ignore
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          //@ts-ignore
          auctionHouseTreasury: auctionHouseObj.auctionHouseTreasury,
          sellerTradeState,
          buyerTradeState,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          programAsSigner,
          rent: web3.SYSVAR_RENT_PUBKEY,
          freeTradeState,
        },
        remainingAccounts,
        signersforSale,
      },
    );

    if (auctionHouseKeypairLoaded) {
      signersforSale.push(auctionHouseKeypairLoaded);

      instruction0.keys
        .filter(k => k.pubkey.equals(auctionHouseKeypairLoaded.publicKey))
        .map(k => (k.isSigner = true));
    }

    if (!auctionHouseSigns) {
      instruction0.keys
        .filter(k => k.pubkey.equals(walletKeyPair.publicKey))
        .map(k => (k.isSigner = true));
    }

    const {txid} = await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      auctionHouseSigns ? auctionHouseKeypairLoaded : walletKeyPair,
      [instruction,instruction0],
      signersforSale,
      'max',
    );

    console.log(
      'Accepted',
      tokenSize,
      mint,
      'sale from wallet',
      sellerWalletKey.toBase58(),
      'to',
      walletKeyPair.publicKey.toBase58(),
      'for',
      buyPrice,
      'from your account with Auction House',
      auctionHouse,
      'with txid', txid
    );
    var output =  {'mintAddress': mint,
    'inwallet':sellerWalletKey.toBase58(),
    'towallet':walletKeyPair.publicKey.toBase58(),
    'price':buyPrice,
    'account':auctionHouse,
    'txid':txid}

    return txid;
  
};

export const deposit = async (cmd : any) => {
    const { wallet, env, amount, auctionHouse, auctionHouseKeypair } =
      cmd;
    const auctionHouseKey = new web3.PublicKey(auctionHouse);
    const walletKeyPair = wallet;

    const auctionHouseKeypairLoaded = auctionHouseKeypair
      ? loadWalletKey(auctionHouseKeypair)
      : null;
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);
    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );
    const amountAdjusted = await getPriceWithMantissa(
      amount,
      auctionHouseObj.treasuryMint,
      walletKeyPair,
      anchorProgram,
    );
    const [escrowPaymentAccount, bump] = await getAuctionHouseBuyerEscrow(
      auctionHouseKey,
      walletKeyPair.publicKey,
    );

    const isNative = auctionHouseObj.treasuryMint.equals(WRAPPED_SOL_MINT);

    const ata = (
      await getAtaForMint(
        auctionHouseObj.treasuryMint,
        walletKeyPair.publicKey,
      )
    )[0];
    const transferAuthority = web3.Keypair.generate();
    const signers = isNative ? [] : [transferAuthority];
    const instruction = await anchorProgram.instruction.deposit(
      bump,
      new BN(amountAdjusted),
      {
        accounts: {
          wallet: walletKeyPair.publicKey,
          paymentAccount: isNative ? walletKeyPair.publicKey : ata,
          transferAuthority: isNative
            ? web3.SystemProgram.programId
            : transferAuthority.publicKey,
          escrowPaymentAccount,
          treasuryMint: auctionHouseObj.treasuryMint,
          authority: auctionHouseObj.authority,
          auctionHouse: auctionHouseKey,
          auctionHouseFeeAccount: auctionHouseObj.auctionHouseFeeAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      },
    );

    if (auctionHouseKeypairLoaded) {
      signers.push(auctionHouseKeypairLoaded);

      instruction.keys
        .filter(k => k.pubkey.equals(auctionHouseKeypairLoaded.publicKey))
        .map(k => (k.isSigner = true));
    }

    if (!isNative) {
      instruction.keys
        .filter(k => k.pubkey.equals(transferAuthority.publicKey))
        .map(k => (k.isSigner = true));
    }

    const currBal = await getTokenAmount(
      anchorProgram,
      escrowPaymentAccount,
      auctionHouseObj.treasuryMint,
    );

    const instructions = [
      ...(isNative
        ? []
        : [
            Token.createApproveInstruction(
              TOKEN_PROGRAM_ID,
              ata,
              transferAuthority.publicKey,
              walletKeyPair.publicKey,
              [],
              amountAdjusted,
            ),
          ]),

      instruction,
      ...(isNative
        ? []
        : [
            Token.createRevokeInstruction(
              TOKEN_PROGRAM_ID,
              ata,
              walletKeyPair.publicKey,
              [],
            ),
          ]),
    ];
    await sendTransactionWithRetryWithKeypair(
      anchorProgram.provider.connection,
      walletKeyPair,
      instructions,
      signers,
      'max',
    );

    console.log(
      'Deposited ',
      amountAdjusted,
      'to your account with Auction House',
      auctionHouse,
      '. New Balance:',
      currBal + amountAdjusted,
    );
    var output = {'deposited': amountAdjusted,'account':auctionHouse,'newBalance':currBal + amountAdjusted}
    
    return output
  };


export async function show(cmd :any){
    console.log(cmd)
    const { wallet, env, auctionHouse, treasuryMint } = cmd;

    const walletKeyPair = wallet;
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);
    let tMintKey;
    if (!treasuryMint) {
      console.log('No treasury mint detected, using SOL.');
      tMintKey = WRAPPED_SOL_MINT;
    } else {
      tMintKey = new web3.PublicKey(treasuryMint);
    }

    const auctionHouseKey = await getAuctionHouseFromOpts(
      auctionHouse,
      walletKeyPair,
      tMintKey,
    );

    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );

    const treasuryAmount = await getTokenAmount(
      anchorProgram,
      auctionHouseObj.auctionHouseTreasury,
      auctionHouseObj.treasuryMint,
    );

    const feeAmount = await anchorProgram.provider.connection.getBalance(
      auctionHouseObj.auctionHouseFeeAccount,
    );

    console.log('-----');
    console.log('Auction House:', auctionHouseKey.toBase58());
    console.log('Mint:', auctionHouseObj.treasuryMint.toBase58());
    console.log('Authority:', auctionHouseObj.authority.toBase58());
    console.log('Creator:', auctionHouseObj.creator.toBase58());
    console.log(
      'Fee Payer Acct:',
      auctionHouseObj.auctionHouseFeeAccount.toBase58(),
    );
    console.log('Treasury Acct:', auctionHouseObj.auctionHouseTreasury.toBase58());
    console.log(
      'Fee Payer Withdrawal Acct:',
      auctionHouseObj.feeWithdrawalDestination.toBase58(),
    );
    console.log(
      'Treasury Withdrawal Acct:',
      auctionHouseObj.treasuryWithdrawalDestination.toBase58(),
    );

    console.log('Fee Payer Bal:', feeAmount);
    console.log('Treasury Bal:', treasuryAmount);
    console.log('Seller Fee Basis Points:', auctionHouseObj.sellerFeeBasisPoints);
    console.log('Requires Sign Off:', auctionHouseObj.requiresSignOff);
    console.log('Can Change Sale Price:', auctionHouseObj.canChangeSalePrice);
    console.log('AH Bump:', auctionHouseObj.bump);
    console.log('AH Fee Bump:', auctionHouseObj.feePayerBump);
    console.log('AH Treasury Bump:', auctionHouseObj.treasuryBump);
    
    auctionHouseObj.auctionHouseKey = auctionHouseKey.toBase58()

    return auctionHouseObj
  };


export const create_auction_house = async (cmd: any) => {
    const {
      wallet,
      env,
      sellerFeeBasisPoints,
      canChangeSalePrice,
      requiresSignOff,
      treasuryWithdrawalDestination,
      feeWithdrawalDestination,
      treasuryMint,
    } = cmd;
    console.log("here")
    const sfbp = parseInt(sellerFeeBasisPoints);

    const walletKeyPair = wallet;
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);
    console.log(walletKeyPair)
    let twdKey: web3.PublicKey,
      fwdKey: web3.PublicKey,
      tMintKey: web3.PublicKey;
    if (!treasuryWithdrawalDestination) {
      console.log('No treasury withdrawal dest detected, using keypair');
      twdKey = walletKeyPair.publicKey.toString();
    } else {
      twdKey = new web3.PublicKey(treasuryWithdrawalDestination);
    }
    if (!feeWithdrawalDestination) {
      console.log('No fee withdrawal dest detected, using keypair');
      fwdKey = walletKeyPair.publicKey;
    } else {
      fwdKey = new web3.PublicKey(feeWithdrawalDestination);
    }

    if (!treasuryMint) {
      console.log('No treasury mint detected, using SOL.');
      tMintKey = WRAPPED_SOL_MINT;
    } else {
      tMintKey = new web3.PublicKey(treasuryMint);
    }

    const twdAta = tMintKey.equals(WRAPPED_SOL_MINT)
      ? twdKey
      : (await getAtaForMint(tMintKey, twdKey))[0];

    const [auctionHouse, bump] = await getAuctionHouse(
      walletKeyPair.publicKey,
      tMintKey,
    );
    console.log("AH",auctionHouse)
    const [feeAccount, feeBump] = await getAuctionHouseFeeAcct(auctionHouse);
    const [treasuryAccount, treasuryBump] = await getAuctionHouseTreasuryAcct(
      auctionHouse,
    );
    await anchorProgram.rpc.createAuctionHouse(
      bump,
      feeBump,
      treasuryBump,
      sfbp,
      requiresSignOff == 'true',
      canChangeSalePrice == 'true',
      {
        accounts: {
          treasuryMint: tMintKey,
          payer: walletKeyPair.publicKey,
          authority: walletKeyPair.publicKey,
          feeWithdrawalDestination: fwdKey,
          treasuryWithdrawalDestination: twdAta,
          treasuryWithdrawalDestinationOwner: twdKey,
          auctionHouse,
          auctionHouseFeeAccount: feeAccount,
          auctionHouseTreasury: treasuryAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
      },
    );
    console.log('Created auction house', auctionHouse.toBase58());
    return auctionHouse.toBase58()
  };

export const update_auction_house = async (cmd : any) => {
    const {
      keypair,
      env,
      sellerFeeBasisPoints,
      canChangeSalePrice,
      requiresSignOff,
      treasuryWithdrawalDestination,
      feeWithdrawalDestination,
      treasuryMint,
      auctionHouse,
      newAuthority,
      force,
    } = cmd;

    const walletKeyPair = keypair;
    const anchorProgram = await loadAuctionHouseProgram(walletKeyPair, env);

    let tMintKey: web3.PublicKey;
    if (!treasuryMint) {
      console.log('No treasury mint detected, using SOL.');
      tMintKey = WRAPPED_SOL_MINT;
    } else {
      tMintKey = new web3.PublicKey(treasuryMint);
    }

    const auctionHouseKey = await getAuctionHouseFromOpts(
      auctionHouse,
      walletKeyPair,
      tMintKey,
    );
    const auctionHouseObj = await anchorProgram.account.auctionHouse.fetch(
      auctionHouseKey,
    );
    tMintKey = auctionHouseObj.treasuryMint;

    let twdKey: web3.PublicKey, fwdKey: web3.PublicKey;
    if (!treasuryWithdrawalDestination) {
      console.log('No treasury withdrawal dest detected, using original value');
      twdKey = tMintKey.equals(WRAPPED_SOL_MINT)
        ? //@ts-ignore
          auctionHouseObj.treasuryWithdrawalDestination
        : deserializeAccount(
            Buffer.from(
              (
                await anchorProgram.provider.connection.getAccountInfo(
                  auctionHouseObj.treasuryWithdrawalDestination,
                )
              ).data,
            ),
          ).owner;
    } else {
      twdKey = new web3.PublicKey(treasuryWithdrawalDestination);
    }
    if (!feeWithdrawalDestination) {
      console.log('No fee withdrawal dest detected, using original value');
      fwdKey = auctionHouseObj.feeWithdrawalDestination;
    } else {
      fwdKey = new web3.PublicKey(feeWithdrawalDestination);
    }
    const twdAta = tMintKey.equals(WRAPPED_SOL_MINT)
      ? twdKey
      : (await getAtaForMint(tMintKey, twdKey))[0];

    let sfbp;
    if (sellerFeeBasisPoints != undefined && sellerFeeBasisPoints != null) {
      sfbp = parseInt(sellerFeeBasisPoints);
    } else {
      console.log('No sfbp passed in, using original value');
      sfbp = auctionHouseObj.sellerFeeBasisPoints;
    }

    let newAuth;
    if (newAuthority != undefined && newAuthority != null) {
      if (!force) {
        throw Error(
          'Cannot change authority without additional force flag. Are you sure you want to do this?',
        );
      }
      newAuth = newAuthority;
    } else {
      console.log('No authority passed in, using original value');
      newAuth = auctionHouseObj.authority;
    }

    let ccsp;
    if (canChangeSalePrice != undefined && canChangeSalePrice != null) {
      ccsp = canChangeSalePrice == 'true';
    } else {
      console.log('No can change sale price passed in, using original value');
      ccsp = auctionHouseObj.canChangeSalePrice;
    }

    let rso;
    if (requiresSignOff != undefined && requiresSignOff != null) {
      rso = requiresSignOff == 'true';
    } else {
      console.log('No requires sign off passed in, using original value');
      rso = auctionHouseObj.requiresSignOff;
    }
    await anchorProgram.rpc.updateAuctionHouse(sfbp, rso, ccsp, {
      accounts: {
        treasuryMint: tMintKey,
        payer: walletKeyPair.publicKey,
        authority: walletKeyPair.publicKey,
        newAuthority: force ? newAuth : auctionHouseObj.authority,
        feeWithdrawalDestination: fwdKey,
        treasuryWithdrawalDestination: twdAta,
        treasuryWithdrawalDestinationOwner: twdKey,
        auctionHouse: auctionHouseKey,
        auctionHouseFeeAccount: auctionHouseObj.feePayer,
        auctionHouseTreasury: auctionHouseObj.treasury,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId,
        ataProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: web3.SYSVAR_RENT_PUBKEY,
      },
    });
    console.log('Updated auction house', auctionHouseKey.toBase58());
    return 
  };


function setLogLevel(value, prev) {
  if (value === undefined || value === null) {
    return;
  }
  console.log('setting the log value to: ' + value);
  log.setLevel(value);
}
