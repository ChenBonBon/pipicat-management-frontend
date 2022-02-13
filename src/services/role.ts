import { Get, Patch, Post } from './request';

export async function fetchRoles(params: any) {
  return await Get('/api/user/roles', params);
}

export async function fetchRoleOptions(params: any) {
  return await Get('/api/user/roles/options', params);
}

export async function fetchRole(id: string) {
  return await Get(`/api/user/role/${id}`);
}

export async function addRole(params: any) {
  return await Post('/api/user/role', params);
}

export async function updateRole(id: string, params: any) {
  return await Patch(`/api/user/role/${id}`, params);
}
