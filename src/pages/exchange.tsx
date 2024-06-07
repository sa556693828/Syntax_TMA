import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "@/components/Provider";
import {
  TonConnectButton,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet,
  TonConnectUI,
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
import { TonClient, TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { buildOnchainMetadata } from "@/utils/jetton-helpers";
import {
  SampleJetton,
  storeTokenTransfer,
} from "../contracts/SampleJetton_SampleJetton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import {
  AssetsSDK,
  createApi,
  PinataStorageParams,
  storeJettonMintMessage,
} from "@ton-community/assets-sdk";
import { assetsConnectSDK } from "@/lib/use-connect";
// import { TonConnectUI } from "@tonconnect/ui";

// get the decentralized RPC endpoint

export default function Exchange() {
  const { goPage } = useContext(Context);
  const bb = useBackButton();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const connectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const jettonMaster = Address.parse(
    "EQD4pOfNjdDA_-MzVGH4aqfNjIHxKrJ_RBLWXg9Bd07EKi8B",
  );
  const NewOwner_Address = Address.parse(
    "UQD6mORg_6kpV0rIS7XMGDBW0D3qWk2JtW5v8xH9fyAQoPMB",
  ); // 🔴 Owner should usually be the deploying wallet's address.
  const deployerAddress = Address.parse(
    "UQCXlMnuTIamRK7Sv7mAWbFnvJX7DKwmpPa2M_w3QGWBrT8Y",
  );
  const testAddress = Address.parse(
    "UQDbbiiaZmmIQa2FLRlQvLDbzRqWVJK6EIbXsV2WLYS2QI8b",
  );
  // const tonweb = new TonWeb(
  //   new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
  //     apiKey: "YOUR_TESTNET_API_KEY",
  //   }),
  // );
  const initJetton = useCallback(async () => {
    if (!wallet) return;
    const provider = await assetsConnectSDK(tonConnectUI as any);
    try {
      const sdk = await provider.sdk;
      const jetton = await sdk.openJetton(jettonMaster);

      const RECEIVER_ADDRESS = deployerAddress;
      const myJettonWallet = await jetton.getWallet(sdk.sender!.address!);
      const result = await myJettonWallet.send(
        provider.sender,
        RECEIVER_ADDRESS,
        toNano(10),
      );
      console.log("✨ result\n" + result);
    } catch (e) {
      console.log(e);
    }

    // const payloadBase64 = beginCell()
    // .store(
    //   storeJettonMintMessage({
    //     queryId: BigInt(0),
    //     amount: BigInt("0.2"),
    //     from: jettonMaster,
    //     to: deployerAddress,
    //     responseAddress: deployerAddress,
    //     forwardPayload: null,
    //     forwardTonAmount: BigInt(1),
    //     walletForwardValue: walletForwardValue,
    //   }),
    // )
    // .endCell()
    // .toBoc()
    // .toString("base64");
  }, []);

  const sendTon = async () => {
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
