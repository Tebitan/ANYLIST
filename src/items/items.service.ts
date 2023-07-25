import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';

import { Item } from './entities/item.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}
  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(newItem);
  }

  async findAll(user: User): Promise<Item[]> {
    // TODO: filtar, paginar por usuario
    return this.itemsRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: {
        id,
        user: {
          id: user.id,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);

    return item;
  }

  async update(updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    const { id } = updateItemInput;
    await this.findOne(id, user);
    const item = await this.itemsRepository.preload({
      ...updateItemInput,
      user,
    });
    if (!item) throw new NotFoundException(`Item with id: ${id} not found`);
    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    //TODO: soft delete, integrate reference
    const item = await this.findOne(id, user);
    console.log(item);
    await this.itemsRepository.remove(item);
    return { ...item, id };
  }

  async itemCountByUser(user: User): Promise<number> {
    return this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
