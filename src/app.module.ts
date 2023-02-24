import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { CategoriesModule } from './categories/categories.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { SubcategoriesModule } from './subcategories/subcategories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PrismaModule,
    UsersModule,
    CategoriesModule,
    SubcategoriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
