import { createModel } from '@rematch/core';
import { addUser, deleteUser, fetchUser, fetchUsers, updateUser } from '@services/user';
import { RootModel } from '.';

export interface User {
  id: string;
  name: string;
  gender?: 'male' | 'female';
  birthday?: string;
  mobile?: string;
  email?: string;
  status: 'enabled' | 'locked';
}

export const user = createModel<RootModel>()({
  state: {
    user: undefined as User | undefined,
  },
  reducers: {
    setUser: (state, payload) => {
      return {
        ...state,
        user: payload,
      };
    },
    resetUser: (state) => {
      return {
        ...state,
        user: undefined,
      };
    },
  },
  effects: (dispatch) => ({
    async fetchUsers(payload) {
      return await fetchUsers(payload);
    },
    async fetchUser(id) {
      const res = await fetchUser(id);
      if (res) {
        dispatch.user.setUser(res);
      }
      return res;
    },
    async addUser(payload) {
      return await addUser(payload);
    },
    async updateUser({ id, payload }) {
      return await updateUser(id, payload);
    },
    async deleteUser(id) {
      return await deleteUser(id);
    },
    async lockUser(id) {
      return await updateUser(id, { status: 'locked' });
    },
    async unLockUser(id) {
      return await updateUser(id, { status: 'enabled' });
    },
  }),
});
