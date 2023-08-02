import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Name Item ' })
  @IsNotEmpty()
  @IsString()
  name: string;
  // @Field(() => Float, { description: 'Quantity Item ' })
  // @IsPositive()
  // quantity: number;
  @Field(() => String, { description: 'Quantity Units Item ', nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
