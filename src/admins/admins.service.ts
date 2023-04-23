import { HttpException, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Admin } from './entities/admin.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '@dto/pagination.dto';
import { AuthAdminDto } from './dto/auth-admin.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
  ) {}

  async auth(authAdminDto: AuthAdminDto) {
    try {
      const foundAdmin = await this.adminModel.findOne({
        email: authAdminDto.email,
      });

      if (!foundAdmin) {
        throw new HttpException({ message: 'Email ou senha inválida' }, 400);
      }

      const isPasswordValid = bcrypt.compareSync(
        authAdminDto.password,
        foundAdmin.password,
      );

      if (!isPasswordValid) {
        throw new HttpException({ message: 'Email ou senha inválida' }, 400);
      }

      const token = this.jwtService.sign({ id: foundAdmin._id });

      return {
        message: 'Autenticado com sucesso',
        token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao fazer login',
        },
        500,
      );
    }
  }

  async create(createAdminDto: CreateAdminDto) {
    try {
      const adminAlreadyExists = await this.adminModel.findOne({
        email: createAdminDto.email,
      });

      if (adminAlreadyExists) {
        throw new HttpException(
          {
            message: 'Este usuário já existe',
          },
          400,
        );
      }

      await this.adminModel.create(createAdminDto);

      return {
        message: 'Usuário criado com sucesso',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao criar usuário',
        },
        500,
      );
    }
  }

  async findAll(pagination: PaginationDto) {
    try {
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;

      const data = await this.adminModel
        .find()
        .select('-password')
        .skip(page > 1 ? (page - 1) * limit : 0)
        .limit(limit);

      const count = await this.adminModel.count();
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
      throw new HttpException(
        {
          message: 'Erro ao buscar usuários',
        },
        500,
      );
    }
  }

  async findOne(id: string) {
    try {
      const admin = await this.adminModel
        .findOne({ _id: id })
        .select('-password');

      if (!admin) {
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          404,
        );
      }

      return admin;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao buscar usuário',
        },
        500,
      );
    }
  }

  async update(id: string, updateAdminDto: UpdateAdminDto) {
    try {
      const admin = await this.adminModel
        .findByIdAndUpdate(
          id,
          {
            $set: {
              ...updateAdminDto,
              updatedAt: Date.now(),
            },
          },
          {
            new: true,
          },
        )
        .select('-password');

      if (!admin) {
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          404,
        );
      }

      return admin;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao atualizar usuário',
        },
        500,
      );
    }
  }

  async remove(id: string) {
    try {
      const admin = await this.adminModel.findById(id);

      if (!admin) {
        throw new HttpException(
          {
            message: 'Usuário não encontrado',
          },
          404,
        );
      }

      admin.deleteOne();

      return { message: 'Usuário removido com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          message: 'Erro ao remover usuário',
        },
        500,
      );
    }
  }
}
