import { Models } from '@rematch/core';
import { permission } from './permission';
import { role } from './role';
import { user } from './user';

export interface RootModel extends Models<RootModel> {
  user: typeof user;
  role: typeof role;
  permission: typeof permission;
}

export const models: RootModel = { user, role, permission };
