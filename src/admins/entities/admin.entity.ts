import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';

@Schema({ timestamps: true })
export class Admin {
  @Prop({ default: uuidv4 })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = bcrypt.hashSync(this.password, 10);
  next();
});
