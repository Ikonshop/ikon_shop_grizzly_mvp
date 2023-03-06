const programId = new web3.PublicKey(
    "G6PHe1YMRavytrbhouywmfnS3iADfQyABUuGiiEFNFGA"
  );
  
  async function sayHello(
    payer: web3.Keypair
  ): Promise<web3.TransactionSignature> {
    const transaction = new web3.Transaction();
    const amount = 1;
    const recipient = new web3.PublicKey('7wK3jPMYjpZHZAghjersW6hBNMgi9VAGr75AhYRqR2n');
    const transactionData = web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: recipient,
        lamports: amount.multipliedBy(1000000000).toNumber(),
    });
    transaction.add(transactionData);
    const serializeConfig = {
        requireAllSignatures: false,
        verifySignatures: true
    };

    const signedTransaction = await web3.sendAndConfirmTransaction(
        pg.connection,
        transaction,
        [payer],
        serializeConfig
    );

    console.log('signedTransaction', signedTransaction);

    const tx = web3.Transaction.from(signedTransaction.rawTransaction);
    const signature = await connection.sendRawTransaction(tx.serialize());
    console.log(`https://explorer.solana.com/tx/${signature}`);
    // const instruction = new web3.TransactionInstruction({
    //     keys: [
    //         { pubkey: payer.publicKey, isSigner: true, isWritable: true },
            
    //     ],
    //     programId,
    // });
  
    // transaction.add(instruction);
  
    // const transactionSignature = await web3.sendAndConfirmTransaction(
    //   pg.connection,
    //   transaction,
    //   [payer]
    // );
  
    return signature;
  }
  
  async function main() {
    console.log('wtff')
    const transactionSignature = await sayHello(pg.wallet.keypair);
  
    console.log(
      'wtffff',
      `Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
    );
  }
  
  main();


// async function main() {
//   // Connect to the local network.
//   const connection = new Connection('http://localhost:8899', 'singleGossip');

//   // Set up a wallet provider with a new keypair.
//   const wallet = Keypair.generate();
//   const provider = new Provider(connection, wallet);

//   // Get the program ID from the on-chain address.
//   const programId = new PublicKey('G6PHe1YMRavytrbhouywmfnS3iADfQyABUuGiiEFNFGA');

//   // Initialize the payer and recipient accounts.
//   const payer = wallet.publicKey;
//   const recipient = new PublicKey('...'); // replace with actual recipient address

//   // Transfer SOL using the CPI method.
//   const tx = new TransferSolWithCpi({
//     accounts: {
//       recipient,
//       payer,
//       systemProgram: SystemProgram.programId,
//     },
//     instructions: [],
//     signers: [],
//   });
//   await program.transferSolWithCpi(amount, tx);

//   // Transfer SOL using the program method.
//   const tx2 = new TransferSolWithProgram({
//     accounts: {
//       recipient,
//       payer,
//       systemProgram: SystemProgram.programId,
//     },
//     instructions: [],
//     signers: [],
//   });
//   await program.transferSolWithProgram(amount, tx2);
// }

// main().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
