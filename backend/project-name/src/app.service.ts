import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import * as tokenJson from './assets/MyERC20Token.json';
import * as ballotJson from './assets/TokenizedBallot.json';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: ethers.Contract;
  tokenizedContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('SEPOLIA_RPC_URL'),
    );
    this.contract = new ethers.Contract(
      this.getAddress('TOKEN_ADDRESS'),
      tokenJson.abi,
      this.provider,
    );
    this.tokenizedContract = new ethers.Contract(
      this.getAddress('TOKENIZED_CONTRACT_ADDRESS'),
      ballotJson.abi, // <-- Use ballotJson.abi instead of tokenJson.abi
      this.provider,
    );
  }

  getHello(): string {
    return 'Hello World!';
  }

  getLastBlock() {
    return this.provider.getBlock('latest');
  }

  getAddress(configKey: string): string {
    const contractAddress = this.configService.get<string>(configKey);
    return contractAddress;
  }

  getTotalSupply() {
    return this.contract.totalSupply();
  }

  getBalanceOf(address: string) {
    return this.contract.balanceOf(address);
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const receipt = await this.getReceipt(tx);
    return receipt;
  }

  async getReceipt(tx: ethers.providers.TransactionResponse) {
    return await tx.wait();
  }

  async requestTokens(address: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    return this.contract
      .connect(signer)
      .mint(address, ethers.utils.parseUnits('100'));
  }

  private async getInjectedSigner(request: Request): Promise<ethers.Signer> {
    const provider = new ethers.providers.JsonRpcProvider(
      this.configService.get<string>('SEPOLIA_RPC_URL'),
    );
    const ethEnabled = (window as any).ethereum;

    if (ethEnabled) {
      await ethEnabled.request({ method: 'eth_requestAccounts' });
      const signer = provider.getSigner();
      return signer;
    } else {
      throw new Error('Please install MetaMask to use this feature');
    }
  }

  // async delegateTokens(address: string, request: Request) {
  //   const signer = await this.getInjectedSigner(request);
  //   return this.contract.connect(signer).delegate(address);
  // }

  async getVotes(address: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    return this.contract.connect(signer).getVotes(address);
  }

  async getBalance(address: string) {
    const pKey = this.configService.get<string>('PRIVATE_KEY');
    const wallet = new ethers.Wallet(pKey);
    const signer = wallet.connect(this.provider);
    return this.tokenizedContract.connect(signer).balanceOf(address);
  }

  async getProposals(proposal: number) {
    const response = await this.tokenizedContract.proposals(proposal);
    const name = response[0];
    const voteCount = response[1].toString();

    return { name, voteCount };
  }

  async vote(proposal: number, amount: string, request: Request) {
    const signer = await this.getInjectedSigner(request);
    return this.tokenizedContract
      .connect(signer)
      .vote(proposal, ethers.utils.parseEther(amount));
  }
}
