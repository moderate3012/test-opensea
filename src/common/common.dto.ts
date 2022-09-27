import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsString } from "class-validator";

export class CommonIdParams {
  @ApiProperty()
  @IsMongoId()
  id: string;
}

export class CommonAddressParams {
  @ApiProperty()
  @IsString()
  address: string;
}

export class ResHashPasswordDto {
  @ApiProperty()
  @IsString()
  salt: string;

  @ApiProperty()
  @IsString()
  hashPassword: string;
}
