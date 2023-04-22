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
    try {
      const product = await this.productModel.create(createProductDto);

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao criar produto',
        },
        500,
      );
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao buscar produtos',
        },
        500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.productModel.findOne({ _id: id });

      if (!product) {
        throw new HttpException(
          {
            message: 'Produto não encontrado',
          },
          404,
        );
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao buscar produto',
        },
        500,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productModel.findByIdAndUpdate(
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

      if (!product) {
        throw new HttpException(
          {
            message: 'Produto não encontrado',
          },
          404,
        );
      }

      return product;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao atualizar produto',
        },
        500,
      );
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productModel.findById(id);

      if (!product) {
        throw new HttpException(
          {
            message: 'Produto não encontrado',
          },
          404,
        );
      }

      product.deleteOne();

      return { message: 'Produto removido com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao remover produto',
        },
        500,
      );
    }
  }
}
