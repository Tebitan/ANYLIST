import { ObjectType, Field, ID } from '@nestjs/graphql';
import { IsPositive } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';

@Entity({ name: 'listItems' })
@Unique('listItem-item', ['list','item'])
@ObjectType()
export class ListItem {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID ListItem ' })
  id: string;

  @Column({ type:'numeric'})
  @Field(() => Number, { description: 'quantity ListItem ' })
  @IsPositive()
  quantity:number;

  @Column({ type:'boolean'})
  @Field(() => Boolean, { description: 'completed ListItem ' })
  completed:boolean;

  @ManyToOne(() => List, (list) => list.listItem, { nullable: false , lazy: true })
  @Field(() => List)
  list:List;

  @ManyToOne(() => Item, (item) => item.listItem, { nullable: false , lazy: true })
  @Field(() => Item)
  item:Item;


}
