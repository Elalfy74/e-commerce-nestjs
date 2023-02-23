import { Category as _Category } from './category';
import { User as _User } from './user';

export namespace PrismaModel {
  export class User extends _User {}
  export class Category extends _Category {}

  export const extraModels = [User, Category];
}
