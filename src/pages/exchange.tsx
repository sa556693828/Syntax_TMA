import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "@/components/Provider";
import {
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useBackButton } from "@tma.js/sdk-react";
import {
  Address,
  beginCell,
  contractAddress,
  fromNano,
  internal,
  toNano,
  OpenedContract,
} from "@ton/core";
import Button from "@/components/ui/button";
import TonWeb from "tonweb";
import { TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { buildOnchainMetadata } from "@/utils/jetton-helpers";
import {
  SampleJetton,
  storeTokenTransfer,
} from "../contracts/SampleJetton_SampleJetton";

export default function InitStory() {
  const { goPage } = useContext(Context);
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const connectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();
  const tonweb = new TonWeb(
    new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
      apiKey: "YOUR_TESTNET_API_KEY",
    }),
  );
  const initJetton = useCallback(async () => {
    const client4 = new TonClient4({
      //create client for testnet sandboxv4 API - alternative endpoint
      endpoint: "https://sandbox-v4.tonhubapi.com",
    });

    let mnemonics = (process.env.NEXT_PUBLIC_MNEMONICS || "").toString(); // 🔴 Change to your own, by creating .env file!
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0;
    let wallet = WalletContractV4.create({
      workchain,
      publicKey: keyPair.publicKey,
    });

    let deployContract = client4.open(wallet);
    const jettonParams = {
      name: "Test Token Jetton",
      description:
        "This is description of Test Jetton Token in Tact-lang Syntax",
      symbol: "TEST",
      image: "https://avatars.githubusercontent.com/u/104382459?s=200&v=4",
    };

    // Create content Cell
    let content = buildOnchainMetadata(jettonParams);
    let max_supply = toNano("666.123456789"); // 🔴 Set the specific total supply in nano
    try {
      let init = await SampleJetton.init(
        deployContract.address,
        content,
        max_supply,
      );
      let jetton_masterWallet = contractAddress(workchain, init);
      let contract_dataFormat = SampleJetton.fromAddress(jetton_masterWallet);
      let contract = client4.open(contract_dataFormat);
      // console.log("✨ " + deployContract.address + "'s Jetton ==> ");
      let jetton_wallet = await contract.getGetWalletAddress(
        deployContract.address,
      );
      console.log("✨ " + deployContract.address + "'s JettonWallet ==> ");
      // ✨Pack the forward message into a cell
      const test_message_left = beginCell()
        .storeBit(0) // 🔴  whether you want to store the forward payload in the same cell or not. 0 means no, 1 means yes.
        .storeUint(0, 32)
        .storeBuffer(Buffer.from("Hello, GM -- Left.", "utf-8"))
        .endCell();

      // const test_message_right = beginCell()
      //     .storeBit(1) // 🔴 whether you want to store the forward payload in the same cell or not. 0 means no, 1 means yes.
      //     .storeRef(beginCell().storeUint(0, 32).storeBuffer(Buffer.from("Hello, GM. -- Right", "utf-8")).endCell())
      //     .endCell();

      // ========================================
      let forward_string_test = beginCell()
        .storeBit(1)
        .storeUint(0, 32)
        .storeStringTail("EEEEEE")
        .endCell();
      let NewOwner_Address = Address.parse(
        "UQCXlMnuTIamRK7Sv7mAWbFnvJX7DKwmpPa2M_w3QGWBrT8Y",
      ); // 🔴 Owner should usually be the deploying wallet's address.

      // let packed = beginCell()
      //   .store(
      //     storeTokenTransfer({
      //       $$type: "TokenTransfer",
      //       query_id: BigInt(0),
      //       amount: toNano(20000),
      //       sender: NewOwner_Address,
      //       response_destination: deployContract.address, // Original Owner, aka. First Minter's Jetton Wallet
      //       custom_payload: forward_string_test,
      //       forward_ton_amount: toNano("0.000000001"),
      //       forward_payload: test_message_left,
      //     }),
      //   )
      //   .endCell();

      // let deployAmount = toNano("0.3");
      // let seqno: number = await deployContract.getSeqno();
      // let balance: bigint = await deployContract.getBalance();
      // console.log("========================================");
      // console.log(
      //   "Current deployment wallet balance: ",
      //   fromNano(balance).toString(),
      //   "💎TON",
      // );
      // console.log("\n🛠️ Calling To JettonWallet:\n" + jetton_wallet + "\n");
      // await deployContract.sendTransfer({
      //   seqno,
      //   secretKey,
      //   messages: [
      //     internal({
      //       to: jetton_wallet,
      //       value: deployAmount,
      //       init: {
      //         code: init.code,
      //         data: init.data,
      //       },
      //       bounce: true,
      //       body: packed,
      //     }),
      //   ],
      // });
    } catch (error) {
      console.error("Error: ", error);
    }
  }, []);
  const bb = useBackButton();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const body = beginCell()
    .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
    .storeStringTail("Hello, TON!") // write our text comment
    .endCell();
  const transaction = {
    validUntil: Math.floor(Date.now() / 1000) + 360,
    messages: [
      {
        address:
          // "0:9794c9ee4c86a644aed2bfb98059b167bc95fb0cac26a4f6b633fc37406581ad", // destination address
          // "0:f267dbaa5e53cd3c75ac47839ea0f20f44206ead9412410a14d0feee6889780e",
          "UQDbbiiaZmmIQa2FLRlQvLDbzRqWVJK6EIbXsV2WLYS2QI8b", // TonKeeper "Test" address on mainnet
        amount: "10000000", // 0.01 Ton
        payload: body.toBoc().toString("base64"), // payload with comment in body
      },
    ],
  };
  const sendTon = async () => {
    try {
      console.log("send");
      const result = await tonConnectUI.sendTransaction(transaction as any);
      // const someTxData = await tonfura.core.getTransactions(result.boc as any);
      console.log("result", result.boc);
      if (result.boc) {
        console.log("Transaction sent successfully");
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    bb.show();
    bb.on("click", onBackButtonClick);
    return () => {
      bb.off("click", onBackButtonClick);
      bb.hide();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center gap-1 p-1">
      <TonConnectButton className="w-full" />
      {wallet && (
        <Button
          className="h-10 w-full rounded-md border bg-white text-lg text-blackBg hover:border-white/20 hover:bg-white/80"
          handleClick={() => sendTon()}
        >
          Send transaction
        </Button>
      )}
      <Button handleClick={() => initJetton()}>Test</Button>
    </div>
  );
}
// const forwardPayload = beginCell()
//         .storeUint(roundSelected?.roundIndex, 8
//         .endCell();

//       const messageBody = beginCell()
//         .storeUint(0x0f8a7ea5, 32) // opcode for jetton transfer
//         .storeUint(0, 64) // query id
//         .storeCoins(toNano(depositAmount)) // jetton amount, amount * 10^9
//         .storeAddress(destinationAddress)
//         .storeAddress(sender.address) // response destination
//         .storeBit(0) // no custom payload
//         .storeCoins(toNano("0.022")) // forward amount - if >0, will send notification message
//         .storeBit(1) // we store forwardPayload as a reference
//         .storeRef(forwardPayload)
//         .endCell();

//       const res = await tonConnectUI.sendTransaction({
//         validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
//         messages: [
//           {
//             address: jettonWalletAddress.toString(),
//             amount: toNano("0.1").toString(),
//             payload: messageBody.toBoc().toString("base64"),
//           },
//         ],
//       });
