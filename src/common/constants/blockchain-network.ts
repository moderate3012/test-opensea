import type { AbiItem } from "web3-utils";

import mainnet from "./blockchain/mainnet";
import testnet from "./blockchain/testnet";
export interface IContract {
  contractAddress: string;
  contractAbi: AbiItem[];
}

export { mainnet, testnet };
