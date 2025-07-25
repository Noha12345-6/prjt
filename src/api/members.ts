import axiosInstance from './axiosInstance';
import { Member } from '../types/member';

// GET all members
export async function getMembers(): Promise<Member[]> {
  const { data } = await axiosInstance.get<Member[]>('/demande');
  return data;
}

// GET one member
export async function getMember(id: string): Promise<Member> {
  const { data } = await axiosInstance.get<Member>(`/demande/${id}`);
  return data;
}

// POST create member
export async function createMember(member: Omit<Member, 'id'>): Promise<Member> {
  const { data } = await axiosInstance.post<Member>('/demande', member);
  return data;
}

// PUT update member
export async function updateMember(id: string, member: Partial<Member>): Promise<Member> {
  const { data } = await axiosInstance.put<Member>(`/demande/${id}`, member);
  return data;
}

// DELETE member
export async function deleteMember(id: string): Promise<void> {
  await axiosInstance.delete(`/demande/${id}`);
} 