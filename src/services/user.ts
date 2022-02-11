import { Delete, Get, Post } from './request';

export async function fetchUsers(params: any) {
  return await Get('/api/user', params);
}

export async function addUser(params: any) {
  return await Post('/api/user', params);
}

export async function deleteUser(id: string) {
  return await Delete(`/api/user/${id}`);
}
