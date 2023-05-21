import { Injectable } from "@nestjs/common";
import { BigNumber, ethers } from "ethers";
import * as MyVotingTokenABI from "./assets/MyVotingToken.json";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  provider: ethers.providers.BaseProvider;
  contract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.provider = ethers.getDefaultProvider("sepolia");
    this.contract = new ethers.Contract(
      this.getContractAddress(),
      MyVotingTokenABI,
      this.provider
    );
  }

  async castVote(proposal: string, amount: BigNumber) {
    const pKey = this.configService.get<string>("PRIVATE_KEY");
    const wallet = new ethers.Wallet(pKey, this.provider);
    const signer = wallet.connect(this.provider);

    return this.contract.connect(signer).castVote(proposal, amount);
  }

  async grantRole(role: string, address: string, signature: string) {
    const pKey = this.configService.get<string>("PRIVATE_KEY");
    const wallet = new ethers.Wallet(pKey, this.provider);
    const signer = wallet.connect(this.provider);
    return this.contract.connect(signer).grantRole(role, address);
  }

  async requestTokens(address: string, signature: string) {
    const pKey = this.configService.get<string>("PRIVATE_KEY");
    const wallet = new ethers.Wallet(pKey, this.provider);
    const signer = wallet.connect(this.provider);
    return this.contract
      .connect(signer)
      .mint(address, ethers.utils.parseEther("20"));
  }

  async getTransactionReceipt(hash: string) {
    const tx = await this.provider.getTransaction(hash);
    const txReceipt = tx.wait();
    return txReceipt;
  }

  getBalanceOf(address: string): Promise<BigNumber> {
    return this.contract.balanceOf(address);
  }

  getTotalSupply() {
    return this.contract.totalSupply();
  }

  getContractAddress() {
    return this.configService.get<string>("MY_VOTING_TOKEN_ADDRESS");
    //https://sepolia.etherscan.io/address/0x1734E67eE6c21f2Ff59CC9F9B209f798f2448862#code
  }

  getLastBlock(): Promise<ethers.providers.Block> {
    return this.provider.getBlock("latest");
  }

  getHello(): string {
    return "Hello World!";
  }
}
