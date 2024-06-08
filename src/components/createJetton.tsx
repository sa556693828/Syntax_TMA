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
  internal,
  toNano,
} from "@ton/core";
import Button from "@/components/ui/button";
import TonWeb from "tonweb";
import { TonClient, TonClient4, WalletContractV4 } from "@ton/ton";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import {
  SampleJetton,
  storeTokenTransfer,
} from "@/contracts/SampleJetton_SampleJetton";
import {
  deployerAddress,
  jettonContent,
  jettonMaster,
  testAddress,
} from "@/constants/jetton";

// get the decentralized RPC endpoint

export default function CreateJetton() {
  const [tonConnectUI, setOptions] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const rawAddress = useTonAddress(false);
  const connectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const { state, open, close } = useTonConnectModal();

  const initJetton = useCallback(async () => {
    if (!wallet) return;
    const endpoint = await getHttpV4Endpoint({
      // network: "testnet",
    });
    const client4 = new TonClient4({
      endpoint,
    });
    let mnemonics = (process.env.NEXT_PUBLIC_MNEMONICS || "").toString();
    let keyPair = await mnemonicToPrivateKey(mnemonics.split(" "));
    let secretKey = keyPair.secretKey;
    let workchain = 0;
    let InitWallet = WalletContractV4.create({
      workchain,
      publicKey: keyPair.publicKey,
    });

    let deployContract = client4.open(InitWallet);
    console.log("✨ deployContract\n" + deployContract.address);
    // EQCXlMnuTIamRK7Sv7mAWbFnvJX7DKwmpPa2M_w3QGWBrWLd

    try {
      const userAddress = Address.parse(rawAddress);
      let init = await SampleJetton.init(deployContract.address, jettonContent);
      let jetton_masterWallet = contractAddress(workchain, init);
      let contract_dataFormat = SampleJetton.fromAddress(jettonMaster); //記得改成init完後的
      let contract = client4.open(contract_dataFormat);
      let jetton_wallet = await contract.getGetWalletAddress(deployerAddress);
      let userJetton_wallet = await contract.getGetWalletAddress(userAddress);
      console.log("✨ jetton_masterWallet\n" + jettonMaster);
      console.log("✨ jetton_wallet\n" + jetton_wallet); //EQArysD_ip6HYa-4zoTmce1pGI8fz3c4RUpfUc9sxGOuAAc6
      console.log("✨ userJetton_wallet\n" + userJetton_wallet);
      // ✨Pack the forward message into a cell
      const test_message_left = beginCell()
        .storeBit(0)
        .storeUint(0, 32)
        .storeBuffer(Buffer.from("Testing", "utf-8"))
        .endCell();

      let forward_string_test = beginCell()
        .storeBit(1)
        .storeUint(0, 32)
        .storeStringTail("EEEEEE")
        .endCell();

      let packed = beginCell()
        .store(
          storeTokenTransfer({
            $$type: "TokenTransfer",
            query_id: BigInt(2),
            amount: toNano(20000),
            sender: testAddress, // send to
            response_destination: userAddress, // Original Owner, aka. First Minter's Jetton Wallet
            custom_payload: forward_string_test,
            forward_ton_amount: toNano("0.000000001"),
            forward_payload: test_message_left,
          }),
        )
        .endCell();

      //   const tx = {
      //     validUntil: Math.floor(Date.now() / 1000) + 360,
      //     messages: [
      //       {
      //         address: userJetton_wallet,
      //         amount: "100000000", //0.1TON
      //         payload: packed.toBoc().toString("base64"),
      //       },
      //     ],
      //   };
      //   const result = await tonConnectUI.sendTransaction(tx as any);

      let amount = toNano("0.3"); //fee
      let seqno: number = await deployContract.getSeqno();
      await deployContract.sendTransfer({
        seqno,
        secretKey,
        messages: [
          internal({
            to: jetton_wallet,
            value: amount,
            init: {
              code: init.code,
              data: init.data,
            },
            bounce: true,
            body: packed,
          }),
        ],
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  }, []);

  return (
    <div className="flex h-[100vh] w-full flex-col items-center gap-1 p-1">
      <Button handleClick={() => initJetton()}>Test</Button>
    </div>
  );
}
