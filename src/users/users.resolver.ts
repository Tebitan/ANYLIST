import { UseGuards, ParseUUIDPipe } from '@nestjs/common';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { User } from './entities/user.entity';
import { Item } from '../items/entities/item.entity';
import { List } from '../lists/entities/list.entity';

import { UsersService } from './users.service';
import { ItemsService } from '../items/items.service';
import { ListsService } from '../lists/lists.service';


import { ValidRolesArgs } from './dto/args/roles.arg';
import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CurrentUser } from '../auth/decorators/user.decorator';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';



@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput, user);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    return this.usersService.block(id, user);
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs:PaginationArgs, @Args() searchArgs:SearchArgs
  ): Promise<Item[]> {
    return this.itemsService.findAll(user,paginationArgs,searchArgs)
  }

  @ResolveField(() => Int, { name: 'listCount' })
  async listCount(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Parent() user: User,
  ): Promise<number> {
    return this.listService.listCountByUser(user);
  }

  @ResolveField(() => [List], { name: 'lists' })
  async getListByUser(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs:PaginationArgs, @Args() searchArgs:SearchArgs
  ): Promise<List[]> {
    return this.listService.findAll(user,paginationArgs,searchArgs)
  }
}
