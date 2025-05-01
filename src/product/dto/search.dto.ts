import { ProductDto } from './product.dto';

export class SearchDto {
  totalItems: number;
  totalPages: number;
  products: ProductDto[];
}
