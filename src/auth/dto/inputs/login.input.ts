import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String, { description: ` Email user` })
  @IsEmail()
  email: string;
  @Field(() => String, { description: `Password user` })
  @MinLength(6)
  password: string;
}
