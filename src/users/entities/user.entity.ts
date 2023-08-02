import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities/item.entity';
import { List } from '../../lists/entities/list.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID user' })
  id: string;
  @Column()
  @Field(() => String, { description: 'Full Name user' })
  fullName: string;

  @Column({ unique: true })
  @Field(() => String, { description: 'Email user' })
  email: string;

  @Column()
  //@Field(() => String, { description: 'Password user' }) no se query con el password
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  @Field(() => [String], { description: 'Roles user' })
  roles: string[];
  @Column({ type: 'boolean', default: true })
  @Field(() => Boolean, { description: 'State user' })
  isActive: boolean;

  //TODO: relaciones
  @ManyToOne(() => User, (user) => user.lastUpdateBy, {
    nullable: true,
    lazy: true,
  })
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field(() => User, { description: 'Last update User', nullable: true })
  lastUpdateBy?: User;

  @OneToMany(() => Item, (item) => item.user, { lazy: true })
 // @Field(() => [Item])
  items: Item[];

  @OneToMany(() => List, (list) => list.user)
  // @Field(() => [Item])
  lists: List[];
}
