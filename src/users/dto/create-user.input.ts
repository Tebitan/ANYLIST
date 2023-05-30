import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: ` Email user` })
  @IsEmail()
  email: string;
  @Field(() => String, { description: `Fullname user` })
  @IsNotEmpty()
  fullName: string;
  @Field(() => String, { description: `Password user` })
  @MinLength(6)
  password: string;
}
