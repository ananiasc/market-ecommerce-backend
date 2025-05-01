import { Body, Controller, Get, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { Filter } from './dto/filter';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('findByFilter')
  async findByFilter(@Body() filter: Filter) {
    return await this.productService.findByFilter(filter);
  }

  @Get('find')
  async findBySlug(@Query('s') slug: string) {
    return await this.productService.findBySlug(slug);
  }
}
