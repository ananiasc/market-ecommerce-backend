import { BadRequestException, Injectable } from '@nestjs/common';
import { Filter } from './dto/filter';
import { ProductRepository } from 'src/repositories/product/product.repository';
import { ProductDto } from './dto/product.dto';
import { SearchDto } from './dto/search.dto';
import { Constants } from 'src/utils/constants';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async findByFilter(filter: Filter) {
    if (filter.minPrice || filter.maxPrice) {
      if (!filter.minPrice || !filter.maxPrice) {
        throw new BadRequestException(
          'minPrice e maxPrice precisam ser preenchidos!',
        );
      }
      if (filter.minPrice >= filter.maxPrice) {
        throw new BadRequestException(
          'minPrice precisa ser menor que maxPrice!',
        );
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

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }
}
