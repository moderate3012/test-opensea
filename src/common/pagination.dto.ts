import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsOptional, IsPositive, IsString } from "class-validator";
import { Type } from "class-transformer";

export class CommonPaginationDto {
  @ApiProperty({ default: 1 })
  @Type(() => Number)
  @IsPositive()
  @IsDefined()
  page: number;

  @ApiProperty({ default: 10 })
  @Type(() => Number)
  @IsPositive()
  @IsDefined()
  pageSize: number;

  @IsString()
  @IsOptional()
  keyword?: string;
}

export class PaginationResDto {
  @ApiProperty({ default: 1 })
  total: number;

  @ApiProperty({ default: 1 })
  page: number;

  @ApiProperty({ default: 10 })
  limit: number;
}
