import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    // TODO: Configuración Básica
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],
    //   useFactory: async (jwtService: JwtService) => ({
    //     playground: false,
    //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //     plugins: [ApolloServerPluginLandingPageLocalDefault()],

    //     context({ req }) {
    //       const token = req.headers.authorization?.replace('Bearer', '').trim();
    //       if (!token) throw Error('Token needed');
    //       const payload = jwtService.decode(token);
    //       if (!payload) throw Error('Token not valid');
    //     },
    //   }),
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.BD_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.BD_PASSWORD,
      database: process.env.BD_NAME,
      synchronize: true,
      autoLoadEntities: true,
    }),
    ItemsModule,
    UsersModule,
    AuthModule,
    SeedModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
