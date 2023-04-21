import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema()
export class Product {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  stock: number;

  @Prop({ required: true })
  price: number;

  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
