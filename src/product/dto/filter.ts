import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class Filter {
  @IsString()
  @IsNotEmpty()
  search: string;

  @IsNumber()
  @IsOptional()
  brandId: number;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  minPrice: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  maxPrice: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  currentPage: number;
}
