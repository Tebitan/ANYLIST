import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID Item ' })
  id: string;
  @Column()
  @Field(() => String, { description: 'Name Item ' })
  name: string;
  @Column()
  @Field(() => Float, { description: 'Quantity Item ' })
  quantity: number;
  @Column({ nullable: true })
  @Field(() => String, { description: 'Quantity Units Item ', nullable: true })
  quantityUnits?: string;
}
