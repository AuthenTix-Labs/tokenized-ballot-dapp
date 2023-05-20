import { ApiProperty } from '@nestjs/swagger';

export class RequestTokensDto {
  @ApiProperty()
  readonly address: string;
}
