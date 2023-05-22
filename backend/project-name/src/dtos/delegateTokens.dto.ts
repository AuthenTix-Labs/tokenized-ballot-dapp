import { ApiProperty } from '@nestjs/swagger';

export class DelegateTokensDto {
  @ApiProperty()
  readonly signedTx: string;
}
