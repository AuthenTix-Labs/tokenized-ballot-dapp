import { ApiProperty } from "@nestjs/swagger";

export class GrantroleDto {
  @ApiProperty()
  readonly role: string;
  @ApiProperty()
  readonly address: string;
  @ApiProperty()
  readonly signature: string;
}
