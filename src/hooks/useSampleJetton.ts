// import { useInit } from "./useInit";
// import { useTonClient } from "./useTonClient";
// import { useTonConnect } from "./useTonConnect";
// import { Address, OpenedContract } from "@ton/core";
// import FaucetJettonWallet from "../contracts/faucetJettonWallet";
// import { useQuery } from "@tanstack/react-query";
// import { SampleJetton } from "@/contracts/SampleJetton_SampleJetton";

// const jettonMaster = "EQAchrCEvXlvAPIPbHWjR5FJ3bkmnq5VGzyXIJ8VZvDkH_L7";
// const selfWallet = "UQCXlMnuTIamRK7Sv7mAWbFnvJX7DKwmpPa2M_w3QGWBrT8Y";
// const selfJettonAddress = "EQBNaNKTrlMO94idiSy1Q7ZtE2fPrLeTw_E_5br4_ZKaJeUq";

// export function useFaucetJettonContract() {
//   const { wallet, sender } = useTonConnect();
//   const { client } = useTonClient();

//   const faucetJettonContract = useInit(async () => {
//     if (!client || !wallet) return;
//     const contract = new SampleJetton(
//       Address.parse("EQAchrCEvXlvAPIPbHWjR5FJ3bkmnq5VGzyXIJ8VZvDkH_L7"), // replace with your address from tutorial 2 step 8
//     );
//     console.log("contract", contract);
//     return client.open(contract) as OpenedContract<SampleJetton>;
//   }, [client, wallet]);

//   const jwContract = useInit(async () => {
//     if (!faucetJettonContract || !client) return;
//     const jettonWalletAddress = await faucetJettonContract!.getWalletAddress(
//       Address.parse(wallet!),
//     );
//     return client!.open(
//       new FaucetJettonWallet(Address.parse(jettonWalletAddress)),
//     ) as OpenedContract<FaucetJettonWallet>;
//   }, [faucetJettonContract, client]);

//   const { data, isFetching } = useQuery({
//     queryKey: ["jetton"],
//     queryFn: async () => {
//       if (!jwContract) return null;

//       return (await jwContract.getBalance()).toString();
//     },
//     refetchInterval: 3000,
//   });

//   return {
//     mint: () => {
//       faucetJettonContract?.sendMintFromFaucet(sender, Address.parse(wallet!));
//     },
//     jettonWalletAddress: jwContract?.address.toString(),
//     balance: isFetching ? null : data,
//   };
// }
