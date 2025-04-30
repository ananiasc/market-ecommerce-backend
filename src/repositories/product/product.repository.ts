import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Filter } from 'src/product/dto/filter';

const PRODUCTS_PER_PAGE = 20;

@Injectable()
export class ProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByFilter(filter: Filter) {
    const skip = PRODUCTS_PER_PAGE * (filter.currentPage - 1);
    const take = PRODUCTS_PER_PAGE;

    return await this.prisma.products.findMany({
      distinct: ['id'],
      where: {
        is_active: true,
        AND: [
          filter.search
            ? {
                OR: [
                  { title: { contains: filter.search, mode: 'insensitive' } },
                  {
                    technical_description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    long_description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {},
          filter.brandId ? { brand_id: filter.brandId } : {},
          filter.categoryId
            ? {
                products_categories: {
                  some: {
                    category_id: filter.categoryId,
                  },
                },
              }
            : {},
          filter.minPrice ? { price: { gte: filter.minPrice } } : {},
          filter.maxPrice ? { price: { lte: filter.maxPrice } } : {},
        ],
      },
      include: {
        products_categories: {
          select: {
            category_id: true,
          },
        },
      },
      skip,
      take,
    });
  }

  async findByFilterCounted(filter: Filter) {
    const products = await this.prisma.products.findMany({
      select: {
        id: true,
      },
      distinct: ['id'],
      where: {
        is_active: true,
        AND: [
          filter.search
            ? {
                OR: [
                  { title: { contains: filter.search, mode: 'insensitive' } },
                  {
                    technical_description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                  {
                    long_description: {
                      contains: filter.search,
                      mode: 'insensitive',
                    },
                  },
                ],
              }
            : {},
          filter.brandId ? { brand_id: filter.brandId } : {},
          filter.categoryId
            ? {
                products_categories: {
                  some: {
                    category_id: filter.categoryId,
                  },
                },
              }
            : {},
          filter.minPrice ? { price: { gte: filter.minPrice } } : {},
          filter.maxPrice ? { price: { lte: filter.maxPrice } } : {},
        ],
      },
    });

    return products.length;
  }
}
