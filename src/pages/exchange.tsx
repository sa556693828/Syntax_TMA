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
import { beginCell, toNano } from "@ton/core";
import Button from "@/components/ui/button";
import { assetsConnectSDK } from "@/lib/use-connect";
import {
  deployerAddress,
  jettonContent,
  jettonMaster,
  testAddress,
} from "@/constants/jetton";
import { SampleJetton, storeMint } from "@/contracts/SampleJetton_SampleJetton";
import axios from "axios";

export default function Exchange() {
  const { goPage } = useContext(Context);
  const bb = useBackButton();
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const connectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const mintJetton = useCallback(async () => {
    if (!wallet) return;
    const provider = await assetsConnectSDK(tonConnectUI as any);
    const url = `https://tonapi.io/v2/blockchain/accounts/${jettonMaster}/transactions?after_lt=0&sort_order=desc`;

    try {
      const response = await axios.get(url);
      const txHashBefore = response.data.transactions[0].hash;
      const sdk = await provider.sdk;
      const contract_dataFormat = SampleJetton.fromAddress(jettonMaster); //記得改成init完後的
      const contract = await sdk.api.open(contract_dataFormat);
      //   const jetton = await sdk.openJetton(jettonMaster);
      const myJettonWallet = await contract.getGetWalletAddress(
        sdk.sender!.address!,
      );

      let mintBody = beginCell()
        .store(
          storeMint({
            $$type: "Mint",
            amount: toNano(1),
          }),
        )
        .endCell();

      // const transaction = {
      //   validUntil: Math.floor(Date.now() / 1000) + 360,
      //   messages: [
      //     {
      //       //但使用JettonMaster會無法顯示交易
      //       address: jettonMaster,
      //       amount: "100000000", // 0.1 Ton
      //       //目前問題直接用mintBody的tonConnectUI會呼叫錯誤
      //       payload: mintBody.toBoc().toString("base64"), // payload with comment in body
      //     },
      //   ],
      // };
      // const result = await tonConnectUI.sendTransaction(transaction as any);

      // await contract.send(
      //   provider.sender,
      //   { value: toNano(0.1) },
      //   {
      //     $$type: "Mint",
      //     amount: toNano(1),
      //   },
      // );

      const res = await axios.get(url);
      const txHash = res.data.transactions[0].hash;
      const txNum = res.data.transactions.length;
      setTxHash(txHash);
      console.log("txHash", txHash);
      // console.log("✨ result\n" + result);
    } catch (e) {
      console.log(e);
    }
  }, []);
  // write a interval timer to check the transaction status
  const checkTx = async () => {
    if (!txHash) return;
    const url = `https://tonapi.io/v2/blockchain/transactions/${txHash}`;
    try {
      const res = await axios.get(url);
      console.log(res.data);
      if (res.data.success) {
        console.log("Transaction success");
        setTxHash(null);
        // updateScore
      }
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (!txHash) return;

    const intervalId = setInterval(() => {
      checkTx();
    }, 2000); // 每兩秒呼叫一次 checkTx

    // 在組件卸載時清除 interval
    return () => clearInterval(intervalId);
  }, [txHash]);

  const sendTon = async () => {
    const body = beginCell()
      .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
      .storeStringTail("Hello, TON!") // write our text comment
      .endCell();
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 360,
      messages: [
        {
          address: testAddress, // TonKeeper "Test" address on mainnet
          amount: toNano(0.01), // 0.01 Ton
          payload: body.toBoc().toString("base64"), // payload with comment in body
        },
      ],
    };
    try {
      console.log("send");
      const result = await tonConnectUI.sendTransaction(transaction as any);
      if (result) {
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
      <a>spend 10 point to mint 1 SYN token</a>

      {wallet && (
        <Button className="h-10 uppercase" handleClick={() => mintJetton()}>
          Mint 1 SYN token
        </Button>
      )}
      {wallet && (
        <Button
          className="text-md h-10 uppercase"
          handleClick={() => sendTon()}
        >
          Transfer 0.01 💎Ton to Team
        </Button>
      )}
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
