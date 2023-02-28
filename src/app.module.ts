import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from '@/app.controller';
import { CategoriesModule } from '@/categories/categories.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductColorImgsModule } from '@/product-color-imgs/product-color-imgs.module';
import { ProductColorsModule } from '@/product-colors/product-colors.module';
import { ProductsModule } from '@/products/products.module';
import { SubcategoriesModule } from '@/subcategories/subcategories.module';
import { UsersModule } from '@/users/users.module';
import { ProductColorSizesModule } from './product-color-sizes/product-color-sizes.module';

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
    ProductsModule,
    ProductColorsModule,
    ProductColorImgsModule,
    ProductColorSizesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
