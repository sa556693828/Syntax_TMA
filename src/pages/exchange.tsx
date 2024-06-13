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
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import GridDot from "@/components/ui/gridDot";
import Card from "@/components/Card";
import { concatAddress } from "@/utils/helpers";
import InfoCard from "@/components/InfoCard";
import { EventEnum } from "@/types/types";
import { toast } from "react-hot-toast";

export default function Exchange() {
  const router = useRouter();
  const { goPage, userData, updateUserToken } = useContext(Context);
  const bb = useBackButton();
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const connectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();
  const onBackButtonClick = () => {
    goPage("/");
  };
  const [txHash, setTxHash] = useState<string | null>(null);
  const [checkingTx, setCheckingTx] = useState(false);
  const [mintAmount, setMintAmount] = useState(0);
  const [minting, setMinting] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkTx = useCallback(async (initialTxHash: string) => {
    const url = `https://tonapi.io/v2/blockchain/accounts/${jettonMaster}/transactions?after_lt=0&sort_order=desc`;
    try {
      const res = await axios.get(url);
      const latestTxHash = res.data.transactions[0].hash;
      if (latestTxHash !== initialTxHash) {
        setTxHash(latestTxHash);
        setCheckingTx(false);
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
      return false;
    }
  }, []);
  useEffect(() => {
    if (checkingTx && txHash) {
      const intervalId = setInterval(async () => {
        const isDifferent = await checkTx(txHash);
        if (isDifferent) {
          await updateUserToken(Number(userData.user_id), EventEnum.buyToken, mintAmount);
          toast.success("Mint success!");
          setLoading(false);
          setMintAmount(0);
          clearInterval(intervalId);
        }
      }, 5000); // 每兩秒檢查一次
      return () => clearInterval(intervalId);
    }
  }, [checkingTx, checkTx, txHash]);

  const mintJetton = useCallback(async () => {
    if (!wallet || !mintAmount || !userData?.tokens || mintAmount > (userData?.tokens || 0)) return;
    const provider = await assetsConnectSDK(tonConnectUI as any);
    const url = `https://tonapi.io/v2/blockchain/accounts/${jettonMaster}/transactions?after_lt=0&sort_order=desc`;

    try {
      setMinting(true);
      setLoading(true);
      const response = await axios.get(url);
      const initialTxHash = response.data.transactions[0].hash;
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

      await contract.send(
        provider.sender,
        { value: toNano(0.1) },
        {
          $$type: "Mint",
          amount: toNano(1),
        },
      );
      setTxHash(initialTxHash);
      setCheckingTx(true);
      // console.log("✨ result\n" + result);
    } catch (e) {
      console.log(e);
    }
  }, [checkTx]);

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

  const handleChange = (e: any) => {
    const value = e.target.value;

    // 只允许输入正整数或0
    const isValid = /^\d*$/.test(value);

    if (isValid) {
      setMintAmount(value);
    }
  };
  const disConnect = async () => {
    await tonConnectUI.disconnect()
  }
  const handleCheckTon = () => {
    window.open(`https://tonviewer.com/${userFriendlyAddress}`, "_blank");
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
    <div className={`flex ${minting ? "h-[100vh]" : "h-full"} min-h-[100vh] w-full flex-col items-center bg-black px-1 pb-1`}>
      <div className="z-20 flex h-24 w-full flex-shrink-0 items-center justify-center bg-transparent px-6 text-lg">
        <FaArrowLeftLong
          size={20}
          onClick={() => router.back()}
          className="absolute left-6 cursor-pointer hover:opacity-60"
        />
        <a className="text-nowrap">STX EXCHANGE</a>
      </div>
      {wallet ? (
        minting ? (
          <div className="flex w-full h-full flex-col gap-1">
            <Card className="flex h-full flex-col items-start justify-center gap-4 p-12">
              <GridDot count={8} />
              <a>{`MINTING... PLEASE CHECK YOUR TON WALLET AFTER 2 MINUTES.`}</a>
            </Card>
            <Button className="h-[62px] uppercase flex-shrink-0 flex items-center justify-center" disabled={loading} handleClick={loading ? () => { } : () => setMinting(false)}>{loading ? <div className="loader" /> : "Return"}</Button>
          </div>
        ) : (
          <div className="flex w-full flex-col gap-1">
            <InfoCard className="h-[82px]">
              <a>wallet:</a>
              <a className="font-bold underline underline-offset-2 cursor-pointer" onClick={handleCheckTon}>{concatAddress(userFriendlyAddress)}</a>
            </InfoCard>
            <InfoCard className="h-[82px]">
              <a>points:</a>
              <a className="font-bold">{`${userData?.tokens} PTS`}</a>
            </InfoCard>
            <InfoCard className="h-[82px] bg-white text-black">
              <a>exchange:</a>
              <div className="relative flex w-full items-center justify-end gap-3">
                <input
                  value={mintAmount}
                  type="text"
                  onChange={handleChange}
                  className="h-full w-full appearance-none bg-transparent text-right font-bold ring-transparent"
                />
                <a className="pt-[2px] font-bold">PTS</a>
              </div>
            </InfoCard>
            <InfoCard className="h-[82px] bg-greyBg text-black">
              <a>receive:</a>
              <a className="font-bold">{`${mintAmount / 10} STX`}</a>
            </InfoCard>
            <InfoCard className="h-[82px]">
              <a>name:</a>
              <a className="font-bold">syntax</a>
            </InfoCard>
            <InfoCard className="h-[82px]">
              <a>symbol:</a>
              <a className="font-bold">STX</a>
            </InfoCard>
            <InfoCard className="h-[82px]">
              <a>type:</a>
              <a className="font-bold">jetton</a>
            </InfoCard>
            <InfoCard className="h-[82px]">
              <a>gas:</a>
              <a className="font-bold">{`< 0.05 ton`}</a>
            </InfoCard>
            <Button
              className="h-[62px] uppercase"
              disabled={mintAmount === 0 || !mintAmount || mintAmount > (userData?.tokens || 0)}
              handleClick={() => mintJetton()}
            >
              Mint
            </Button>
            <Button
              className="h-[62px] uppercase"
              handleClick={() => disConnect()}
            >
              Disconnect
            </Button>
          </div>
        )
      ) : (
        <>
          <Card className="mb-1 flex h-full flex-1 flex-col items-start justify-center gap-4 p-12">
            <GridDot count={8} />
            <a className="whitespace-pre-wrap text-black">
              {`WELCOME TO THE SYNTKN EXCHANGE. `}
              <b>
                {`CONVERT YOUR POINTS INTO STX, PAVING THE WAY FOR FUTURE REWARDS AND BENEFITS. `}
              </b>
              {`BEGIN EXCHANGING AND BE PREPARED FOR WHAT'S TO COME.`}
            </a>
          </Card>

          <Button
            className="h-[62px] flex-shrink-0 uppercase"
            handleClick={open}
          >
            connect ton wallet
          </Button>
        </>
      )}
    </div>
  );
}
// {wallet && (
//   <Button className="h-10 uppercase" handleClick={() => mintJetton()}>
//     Mint 1 SYN token
//   </Button>
// )}
// {wallet && (
//   <Button
//     className="text-md h-10 uppercase"
//     handleClick={() => sendTon()}
//   >
//     Transfer 0.01 💎Ton to Team
//   </Button>
// )}
