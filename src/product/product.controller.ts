import { Body, Controller, Get, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Filter } from './dto/filter';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('findByFilter')
  async findByFilter(@Body() filter: Filter) {
    return await this.productService.findByFilter(filter);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(+id);
  }
}
