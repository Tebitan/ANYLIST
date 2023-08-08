import { InputType, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  @Field(() => Number, { nullable:true, description: 'quantity ListItem ' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity:number = 0;

  @Field(() => Boolean, { nullable:true, description: 'completed  ListItem' })
  @IsBoolean()
  @IsOptional()
  completed:boolean = false;

  @Field(() => ID, {description: 'ID  List' })
  @IsUUID()
  listId:string;

  @Field(() => ID, {description: 'ID  Item' })
  @IsUUID()
  itemId:string;

}
