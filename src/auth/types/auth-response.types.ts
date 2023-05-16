import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';

@ObjectType()
export class AuthResponse {
  @Field(() => String, { description: `Token` })
  token: string;
  @Field(() => User, { description: `User` })
  user: User;
}
