import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = await this.productModel.create(createProductDto);

    if (!product) {
      throw new HttpException('Erro ao criar produto', 400);
    }

    return product;
  }

  async findAll(pagination: PaginationDto) {
    const page = pagination.page || 1;
    const limit = pagination.limit || 10;

    const data = await this.productModel
      .find()
      .skip(page > 1 ? (page - 1) * limit : 0)
      .limit(limit);

    const count = await this.productModel.count();
    const pages = Math.ceil(count / limit);

    return {
      data,
      pagination: {
        current: page,
        next: page < pages ? page + 1 : undefined,
        total: pages,
      },
    };
  }

  findOne(id: string) {
    return this.productModel.findById(id);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return this.productModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updateProductDto,
          updatedAt: Date.now(),
        },
      },
      {
        new: true,
      },
    );
  }

  async remove(id: string) {
    const product = await this.productModel.findById(id);

    if (!product) {
      throw new HttpException('Produto não encontrado', 404);
    }

    product.deleteOne();

    return { message: 'Produto removido com sucesso' };
  }
}
