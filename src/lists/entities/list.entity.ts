import { ObjectType, Field, ID } from '@nestjs/graphql';

import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ListItem } from '../../list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID List ' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Name List ' })
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false , lazy: true })
  @Index('list-user-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list ,{ nullable: false , lazy: true })
  //@Field(() => [ListItem])
  listItem:ListItem[];

}
