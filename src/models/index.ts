import { Models } from '@rematch/core';
import { role } from './role';
import { user } from './user';

export interface RootModel extends Models<RootModel> {
  user: typeof user;
  role: typeof role;
}

export const models: RootModel = { user, role };
