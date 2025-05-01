import { Category } from './category.dto';

export class ProductDto {
  code: string;
  title: string;
  technicalDescription: string;
  longDescription: string;
  price: number;
  discountedPrice: number;
  isDiscounted: boolean;
  typeId: number;
  stock: number;
  slug: string;
  brandId: number;
  categories: Category[];

  constructor(product: any) {
    this.code = product.code;
    this.title = product.title;
    this.technicalDescription = product.technical_description;
    this.longDescription = product.long_description;
    this.price = product.price;
    this.discountedPrice = product.discounted_price;
    this.isDiscounted = product.is_discounted;
    this.typeId = product.type_id;
    this.stock = product.stock;
    this.slug = product.slug;
    this.brandId = product.brand_id;
    this.categories = [];
    for (const category of product.products_categories) {
      this.categories.push(new Category(category.category_id));
    }
  }
}
