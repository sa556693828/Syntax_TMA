import { useCallback } from "react";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import { beginCell, internal } from "@ton/core";
import { TonClient, TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";

export default function useSendTon() {
  const [tonConnectUI, setOptions] = useTonConnectUI();

  const initJetton = useCallback(async () => {
    const endpoint = await getHttpV4Endpoint({
      // network: "testnet",
    });
    const client4 = new TonClient4({
      endpoint,
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
    // let balance: bigint = await deployContract.getBalance();
    // console.log("🔴 Balance: ", fromNano(balance));
    try {
      const seqno: number = await deployContract.getSeqno();
      console.log("🔴 seqno: ", seqno);
      const transfer = await deployContract.sendTransfer({
        seqno,
        secretKey,
        messages: [
          internal({
            value: "1.5",
            to: "UQDbbiiaZmmIQa2FLRlQvLDbzRqWVJK6EIbXsV2WLYS2QI8b",
            body: "Hello world",
          }),
        ],
      });
      console.log("🔴 Transfer: ", transfer);
    } catch (error) {
      console.log("🔴 Error: ", error);
    }
  }, []);

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
}
