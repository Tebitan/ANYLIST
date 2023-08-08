import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './../users/entities/user.entity';
import { List } from '../lists/entities/list.entity';

import { Item } from './../items/entities/item.entity';
import { SEED_ITEMS, SEED_USERS, SEED_LISTS } from './data/seed-data';
import { UsersService } from '../users/users.service';
import { ItemsService } from '../items/items.service';
import { ListItem } from '../list-item/entities/list-item.entity';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {
    this.isProd = configService.get('STATE') === 'prod';
  }

  async executeSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run SEED on Prod');
    }
    await this.deleteDataBase();
    const user = await this.loadUsers();
    await this.loadItems(user);
    const list = await this.loadList(user);
    const items = await this.itemsService.findAll(
      user,
      { limit: 35, offset: 0 },
      {},
    );
    await this.loadListItems(list, items);

    return true;
  }

  async deleteDataBase() {
    //borrar list Items
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //borrar list
    await this.listRepository.createQueryBuilder().delete().where({}).execute();

    //borrar items
    await this.itemsRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();

    //borar users
    await this.usersRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
  }

  async loadUsers(): Promise<User> {
    const users = [];
    for (const user of SEED_USERS) {
      users.push(await this.usersService.create(user));
    }
    return users[0];
  }

  async loadItems(user: User): Promise<void> {
    const itemsPromises = [];
    for (const item of SEED_ITEMS) {
      itemsPromises.push(this.itemsService.create(item, user));
    }
    await Promise.all(itemsPromises);
  }

  async loadList(user: User): Promise<List> {
    const lists = [];
    for (const list of SEED_LISTS) {
      lists.push(await this.listsService.create(list, user));
    }
    return lists[0];
  }

  async loadListItems(list: List, items: Item[]): Promise<void> {
    const itemsPromises = [];
    for (const item of items) {
      itemsPromises.push(
        this.listItemsService.create({
          quantity: Math.round(Math.random() * 10),
          completed: Math.round(Math.random() * 1) === 0 ? false : true,
          listId: list.id,
          itemId: item.id,
        }),
      );
    }
    await Promise.all(itemsPromises);
  }
}
