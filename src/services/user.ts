import { Delete, Get, Patch, Post } from './request';

export async function fetchUsers(params: any) {
  return await Get('/api/user', params);
}

export async function fetchUser(id: string) {
  return await Get(`/api/user/${id}`);
}

export async function addUser(params: any) {
  return await Post('/api/user', params);
}

export async function deleteUser(id: string) {
  return await Delete(`/api/user/${id}`);
}

export async function updateUser(id: string, params: any) {
  return await Patch(`/api/user/${id}`, params);
}

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
