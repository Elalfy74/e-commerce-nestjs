import { UserRelations as _UserRelations } from './user_relations';
import { CategoryRelations as _CategoryRelations } from './category_relations';
import { SubCategoryRelations as _SubCategoryRelations } from './sub_category_relations';
import { ProductRelations as _ProductRelations } from './product_relations';
import { ProductColorRelations as _ProductColorRelations } from './product_color_relations';
import { ProductColorImgRelations as _ProductColorImgRelations } from './product_color_img_relations';
import { ProductColorSizeRelations as _ProductColorSizeRelations } from './product_color_size_relations';
import { User as _User } from './user';
import { Category as _Category } from './category';
import { SubCategory as _SubCategory } from './sub_category';
import { Product as _Product } from './product';
import { ProductColor as _ProductColor } from './product_color';
import { ProductColorImg as _ProductColorImg } from './product_color_img';
import { ProductColorSize as _ProductColorSize } from './product_color_size';

export namespace PrismaModel {
  export class UserRelations extends _UserRelations {}
  export class CategoryRelations extends _CategoryRelations {}
  export class SubCategoryRelations extends _SubCategoryRelations {}
  export class ProductRelations extends _ProductRelations {}
  export class ProductColorRelations extends _ProductColorRelations {}
  export class ProductColorImgRelations extends _ProductColorImgRelations {}
  export class ProductColorSizeRelations extends _ProductColorSizeRelations {}
  export class User extends _User {}
  export class Category extends _Category {}
  export class SubCategory extends _SubCategory {}
  export class Product extends _Product {}
  export class ProductColor extends _ProductColor {}
  export class ProductColorImg extends _ProductColorImg {}
  export class ProductColorSize extends _ProductColorSize {}

  export const extraModels = [
    UserRelations,
    CategoryRelations,
    SubCategoryRelations,
    ProductRelations,
    ProductColorRelations,
    ProductColorImgRelations,
    ProductColorSizeRelations,
    User,
    Category,
    SubCategory,
    Product,
    ProductColor,
    ProductColorImg,
    ProductColorSize,
  ];
}
