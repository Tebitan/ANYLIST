import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  @Index('userId-list-index')
  @Field(() => User)
  user: User;
}