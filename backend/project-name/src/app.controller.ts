import { Controller, Get, Post, Param, Query, Body, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestTokensDto } from './dtos/requestTokens.dto';
import { DelegateTokensDto } from './dtos/delegateTokens.dto';
import { VoteDto } from './dtos/vote.dto';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('last-block')
  getLastBlock() {
    return this.appService.getLastBlock();
  }

  @Get('address/:configKey')
  getAddress(@Param('configKey') configKey: string) {
    return this.appService.getAddress(configKey);
  }

  @Get('total-supply')
  getTotalSupply() {
    return this.appService.getTotalSupply();
  }

  @Get('balance/:address')
  getBalanceOf(@Param('address') address: string) {
    return this.appService.getBalanceOf(address);
  }

  @Get('transaction-receipt/')
  async getTransactionReceipt(@Query('hash') hash: string) {
    return await this.appService.getTransactionReceipt(hash);
  }

  @Post('request-tokens')
  requestTokens(@Body() body: RequestTokensDto) {
    return this.appService.requestTokens(body.address);
  }

  // @Post('delegate-tokens')
  // async delegateTokens(
  //   @Body() body: DelegateTokensDto,
  //   @Req() request: Request,
  // ) {
  //   const { address } = body;
  //   try {
  //     const result = await this.appService.delegateTokens(address, request);
  //     return { result };
  //   } catch (error) {
  //     console.error(error.message); // Log the error message
  //     throw new Error('An error occurred');
  //   }
  // }

  @Get('votes/:address')
  async getVotes(@Param('address') address: string) {
    return this.appService.getVotes(address);
  }

  @Get('balance/:address')
  async getBalance(@Param('address') address: string) {
    return this.appService.getBalance(address);
  }

  @Get('proposals/:proposal')
  async getProposals(@Param('proposal') proposal: number) {
    return this.appService.getProposals(proposal);
  }

  @Post('vote')
  async vote(@Body() body: VoteDto, @Req() request: Request) {
    const result = await this.appService.vote(
      body.proposal,
      body.amount,
      request,
    );
    return { result };
  }
}
