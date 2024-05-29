import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Product, ProductDocument } from 'src/common/schemas/product.schema';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private cloudinaryService: CloudinaryService,
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

  async create({
    images,
    createProductDto: { data },
  }: {
    images: Express.Multer.File[];
    createProductDto: CreateProductDto;
  }) {
    const folder = 'product-images';
    const uploadPromises = images.map((file) =>
      this.cloudinaryService.uploadFile(file, folder),
    );
    const imageUrls = await Promise.all(uploadPromises);

    const dataObject = JSON.parse(JSON.parse(data));

    await this.checkIfProductExists(dataObject.name, dataObject.sku);

    const createdProduct = new this.productModel({
      ...dataObject,
      images: imageUrls,
    });

    return createdProduct.save();
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

    return product;
  }

  async remove(id: string): Promise<Product> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
