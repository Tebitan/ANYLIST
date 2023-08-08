import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ListItem } from './entities/list-item.entity';
import { List } from '../lists/entities/list.entity';

import { PaginationArgs, SearchArgs } from './../common/dto/args';

import { CreateListItemInput, UpdateListItemInput } from './dto/inputs';
import { ID } from '@nestjs/graphql';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemsRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;

    const newListItem = this.listItemsRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });

    await this.listItemsRepository.save(newListItem);
    return this.findOne(newListItem.id);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });
    if (search) {
      //queryBuilder.andWhere('LOWER(name) like :name', { name: `%${search}%` });
    }
    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemsRepository.findOneBy({ id });
    if (!listItem)
      throw new NotFoundException(`List Item with id ${id} not found `);

    return listItem;
  }

  async update(updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { id, listId, itemId, ...rest } = updateListItemInput;

    const queryBuilder = this.listItemsRepository
      .createQueryBuilder()
      .update()
      .set(rest)
      .where('id = :id', { id });

    if (listId)
      queryBuilder.set({
        list: { id: listId },
      });

    if (itemId)
      queryBuilder.set({
        item: { id: itemId },
      });

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async listItemCountByList(list: List): Promise<number> {
    return this.listItemsRepository.count({
      where: {
        list: { id: list.id },
      },
    });
  }
}
