import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { Roles } from './enums/roles';

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'departments' })
  department: string;

  @Prop({ enum: Roles })
  role: string;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  authToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//Hashes password before storinh into DB
UserSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    throw new Error(err);
  }
});
