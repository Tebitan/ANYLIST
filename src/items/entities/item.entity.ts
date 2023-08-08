import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { User } from './../../users/entities/user.entity';
import { ListItem } from '../../list-item/entities/list-item.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID Item ' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Name Item ' })
  name: string;
  // @Column()
  // @Field(() => Float, { description: 'Quantity Item ' })
  // quantity: number;
  @Column({ nullable: true })
  @Field(() => String, { description: 'Quantity Units Item ', nullable: true })
  quantityUnits?: string;

  @ManyToOne(() => User, (user) => user.items, { nullable: false,lazy: true })
  @Index('userId-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.item ,{ nullable: false , lazy: true })
  @Field(() => [ListItem])
  listItem:ListItem[];
}
