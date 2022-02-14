import { Get, Patch, Post } from './request';

export async function fetchRoles(params: any) {
  return await Get('/api/role', params);
}

export async function fetchRoleOptions(params: any) {
  return await Get('/api/role/options', params);
}

export async function fetchRole(id: string) {
  return await Get(`/api/role/${id}`);
}

export async function addRole(params: any) {
  return await Post('/api/role', params);
}

export async function updateRole(id: string, params: any) {
  return await Patch(`/api/role/${id}`, params);
}
