import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductDto } from 'src/common/dto/product.dto';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';

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

  async findAll(): Promise<Product[]> {
    const productDocuments = await this.productModel.find().exec();

    return productDocuments.map((product) => product.toObject());
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product.toObject();
  }

  async create(createProductDto: ProductDto) {
    await this.checkIfProductExists(
      createProductDto.productName,
      createProductDto.sku,
    );

    const newProduct = await this.productModel.create(createProductDto);

    return newProduct.toObject();
  }

  async update(id: string, updateUserDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
      },
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product.toObject();
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product.toObject();
  }
}
