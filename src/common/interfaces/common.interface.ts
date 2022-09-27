import type { AbiItem } from "web3-utils";

export interface IUser {
  note: string;
  phoneNumber: string;
  isActive: boolean;
  verified: boolean;
  email: string;
  fullName: string;
  password: string;
  salt: string;
  roles: string;
  createdAt: Date;
  updatedAt: Date;
  id: string;
  firstLogin: boolean;
}

interface IContract {
  contractAddress: string;
  contractAbi: AbiItem[];
  address?: string;
  blocknumber?: number;
  addressTokenEarn?: string;
  addressTokenStake?: string;
  tokenStake?: string;
  weight?: number;
  old?: boolean;
}
export interface IListContract {
  [key: string]: IContract;
}
