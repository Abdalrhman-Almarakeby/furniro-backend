import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from 'src/common/dto/product.dto';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  private async checkIfProductExists(
    productName: string,
    sku: number,
  ): Promise<void> {
    const existingProduct = await this.productModel.findOne({
      $or: [{ productName }, { sku }],
    });

    if (!existingProduct) return;

    if (existingProduct.productName === productName) {
      throw new BadRequestException('Product with this name already exists');
    }
    if (existingProduct.sku === sku) {
      throw new BadRequestException('Product with this SKU already exists');
    }
  }

  async create(createProductDto: ProductDto) {
    await this.checkIfProductExists(
      createProductDto.productName,
      createProductDto.sku,
    );

    const newProduct = await this.productModel.create(createProductDto);

    return newProduct.toObject();
  }
}
