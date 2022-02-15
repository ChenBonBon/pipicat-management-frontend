import { createModel } from '@rematch/core';
import { addRole, fetchRole, fetchRoleOptions, fetchRoles, updateRole } from '@services/role';
import { fetchPermissions } from '@src/services/permission';
import { RootModel } from '.';

export interface Permission {
  id: string;
  name: string;
  description?: string;
  status: 'enabled' | 'disabled';
}

export interface RoleOption {
  id: string;
  name: string;
}

export const permission = createModel<RootModel>()({
  state: {
    permission: undefined as Permission | undefined,
    roleOptions: [] as RoleOption[],
  },
  reducers: {
    setRole: (state, payload) => {
      return {
        ...state,
        role: payload,
      };
    },
    resetPermission: (state) => {
      return {
        ...state,
        permission: undefined,
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
    async fetchPermissions(payload) {
      return await fetchPermissions(payload);
    },
    async fetchRoleOptions(payload) {
      const res = await fetchRoleOptions(payload);
      if (res) {
        dispatch.role.setRoleOption(res);
      }
    },
    async fetchRole(id) {
      const res = await fetchRole(id);
      if (res) {
        dispatch.role.setRole(res);
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
