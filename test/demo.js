import utils from "@aztec/dev-utils";

const aztec = require("aztec.js");
const dotenv = require("dotenv");
dotenv.config();
const secp256k1 = require("@aztec/secp256k1");

const ZkAssetMintable = artifacts.require("./ZkAssetMintable.sol");

const {
  proofs: { MINT_PROOF }
} = utils;

const { JoinSplitProof, MintProof } = aztec;

contract("Private payment", accounts => {
  const lender = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_0
  );
  const borrower = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_1
  );
  let privatePaymentContract;

  beforeEach(async () => {
    privatePaymentContract = await ZkAssetMintable.deployed();
  });

  it("Lender should be able to deposit 100 then pay Borrower 75 by splitting notes he owns", async () => {
    console.log("----------------------------");
    console.log("Lender wants to deposit 100");
    const lenderNote1 = await aztec.note.create(lender.publicKey, 100);

    const newMintCounterNote = await aztec.note.create(lender.publicKey, 100);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const sender = accounts[0];
    const mintedNotes = [lenderNote1];

    const mintProof = new MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      sender
    );

    const mintData = mintProof.encodeABI();

    await privatePaymentContract.confidentialMint(MINT_PROOF, mintData, {
      from: accounts[0]
    });

    console.log("completed mint proof");
    console.log("Lender successfully deposited 100");
    console.log("------------------------------------");
    console.log("Lender wants to lend to Borrower 25");

    const borrowerAsk = await aztec.note.create(borrower.publicKey, 25);

    console.log("The fare comes to 25");
    const lenderNote2 = await aztec.note.create(lender.publicKey, 75);
    const sendProofSender = accounts[0];
    const withdrawPublicValue = 0;
    const publicOwner = accounts[0];

    const sendProof = new JoinSplitProof(
      mintedNotes,
      [borrowerAsk, lenderNote2],
      sendProofSender,
      withdrawPublicValue,
      publicOwner
    );
    const sendProofData = sendProof.encodeABI(privatePaymentContract.address);
    const sendProofSignatures = sendProof.constructSignatures(
      privatePaymentContract.address,
      [lender]
    );
    await privatePaymentContract.methods["confidentialTransfer(bytes,bytes)"](
      sendProofData,
      sendProofSignatures,
      {
        from: accounts[0]
      }
    );

    console.log("Lender lend borrower 25 for the Loan and gets 75 back");
    console.log("------------------------------------");

  });
});
