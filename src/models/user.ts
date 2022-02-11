import { createModel } from '@rematch/core';
import { addUser, deleteUser, fetchUsers, updateUser } from '@src/services/user';
import { RootModel } from '.';

export const user = createModel<RootModel>()({
  state: {},
  reducers: {},
  effects: () => ({
    async fetchUsers(payload) {
      return await fetchUsers(payload);
    },
    async addUser(payload) {
      return await addUser(payload);
    },
    async deleteUser(id) {
      return await deleteUser(id);
    },
    async lockUser(id) {
      return await updateUser(id, 'locked');
    },
    async unLockUser(id) {
      return await updateUser(id, 'enabled');
    },
  }),
});
