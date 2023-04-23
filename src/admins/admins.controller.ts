import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PaginationDto } from '@dto/pagination.dto';
import { AuthAdminDto } from './dto/auth-admin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('auth')
  auth(@Body() authAdminDto: AuthAdminDto) {
    return this.adminsService.auth(authAdminDto);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminsService.create(createAdminDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() pagination: PaginationDto) {
    return this.adminsService.findAll(pagination);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.adminsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.adminsService.remove(id);
  }
}
