import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { ItemsModule } from '../items/items.module';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  providers: [SeedResolver, SeedService],
  imports:[ConfigModule,ItemsModule,UsersModule]

})
export class SeedModule {}
