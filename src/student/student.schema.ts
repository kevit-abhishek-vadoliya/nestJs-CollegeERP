import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import mongoose, { Types } from 'mongoose';

@Schema()
export class Student {
  @Prop()
  name: string;

  @Prop()
  contactNo: number;

  @Prop({ ref: 'department' })
  department: Types.ObjectId;

  @Prop()
  batchYear: number;

  @Prop()
  semester: number;

  @Prop({ lowercase: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.Mixed }] })
  attendance: any;

  @Prop()
  authToken: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (err) {
    throw new Error(err);
  }
});