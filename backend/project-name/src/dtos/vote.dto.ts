import { ApiProperty } from '@nestjs/swagger';

export class VoteDto {
  @ApiProperty()
  readonly proposal: number;
  @ApiProperty()
  readonly amount: string;
}
