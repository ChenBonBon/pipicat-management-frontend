import { createModel } from '@rematch/core';
import {
  addRole,
  addUser,
  deleteUser,
  fetchRole,
  fetchRoleOptions,
  fetchRoles,
  fetchUser,
  fetchUsers,
  updateRole,
  updateUser,
} from '@src/services/user';
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

export interface Role {
  id: string;
  name: string;
  description?: string;
  status: 'enabled' | 'disabled';
}

export interface RoleOption {
  id: string;
  name: string;
}

export const user = createModel<RootModel>()({
  state: {
    user: undefined as User | undefined,
    role: undefined as Role | undefined,
    roleOptions: [] as RoleOption[],
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
    setRole: (state, payload) => {
      return {
        ...state,
        role: payload,
      };
    },
    resetRole: (state) => {
      return {
        ...state,
        role: undefined,
      };
    },
    setRoleOption: (state, payload) => {
      return {
        ...state,
        roleOptions: payload,
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
    async fetchRoles(payload) {
      return await fetchRoles(payload);
    },
    async fetchRoleOptions(payload) {
      const res = await fetchRoleOptions(payload);
      if (res) {
        dispatch.user.setRoleOption(res);
      }
    },
    async fetchRole(id) {
      const res = await fetchRole(id);
      if (res) {
        dispatch.user.setRole(res);
      }
      return res;
    },
    async addRole(payload) {
      return await addRole(payload);
    },
    async updateRole({ id, payload }) {
      return await updateRole(id, payload);
    },
    async enableRole(id) {
      return await updateRole(id, { status: 'enabled' });
    },
    async disableRole(id) {
      return await updateRole(id, { status: 'disabled' });
    },
  }),
});
