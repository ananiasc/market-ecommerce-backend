import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Filter } from './dto/filter';
import { ProductRepository } from 'src/repositories/product/product.repository';
import { ProductDto } from './dto/product.dto';
import { SearchDto } from './dto/search.dto';
import { Constants } from 'src/utils/constants';
import { ErrorMessages } from 'src/global/global.messages';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findByFilter(filter: Filter) {
    if (filter.minPrice || filter.maxPrice) {
      if (!filter.minPrice || !filter.maxPrice) {
        throw new BadRequestException(
          ErrorMessages.MIN_PRICE_AND_MAX_PRICE_REQUIRED,
        );
      }
      if (filter.minPrice >= filter.maxPrice) {
        throw new BadRequestException(ErrorMessages.MIN_PRICE_LESS_MAX_PRICE);
      }
    }
    const [products, totalCount] = await Promise.all([
      await this.productRepository.findByFilter(filter),
      await this.productRepository.findByFilterCounted(filter),
    ]);
    const productsDto: ProductDto[] = [];
    for (const product of products) {
      productsDto.push(new ProductDto(product));
    }
    const totalPages = Math.ceil(totalCount / Constants.PRODUCTS_PER_PAGE);
    const searchDto: SearchDto = {
      totalItems: totalCount,
      totalPages: totalPages,
      products: productsDto,
    };

    return searchDto;
  }

  async findBySlug(slug: string) {
    if (!slug) {
      throw new BadRequestException(ErrorMessages.SLUG_IS_EMPTY);
    }
    const product = await this.productRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundException(ErrorMessages.PRODUCT_NOT_FOUND);
    }
    return new ProductDto(product);
  }
}
