import { buildOnchainMetadata } from "@/utils/jetton-helpers";
import { Address } from "@ton/core";

export const jettonParams = {
  name: "Syntax",
  description: "Syntax jetton token",
  symbol: "STN",
  image: "https://syntax-tma.vercel.app/jetton.svg",
};
// Create content Cell
export let jettonContent = buildOnchainMetadata(jettonParams);
export const jettonMaster = Address.parse(
  "EQAKr2dtVGhmPEBsZzBpCUDCFXh_N3_PoEaOtdnRlZz5NLwj",
);
export const NewOwner_Address = Address.parse(
  "UQD6mORg_6kpV0rIS7XMGDBW0D3qWk2JtW5v8xH9fyAQoPMB",
);
export const deployerAddress = Address.parse(
  "UQCXlMnuTIamRK7Sv7mAWbFnvJX7DKwmpPa2M_w3QGWBrT8Y",
);
export const testAddress = Address.parse(
  "UQDbbiiaZmmIQa2FLRlQvLDbzRqWVJK6EIbXsV2WLYS2QI8b",
);
