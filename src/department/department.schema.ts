import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Department {
  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  initial: string;

  @Prop({ required: true })
  totalStudentsIntake: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
