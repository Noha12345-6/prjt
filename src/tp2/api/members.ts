
import axios from "axios";
import { type Member, type MemberCreate, type MemberUpdate } from "../api/types/member";

const api = axios.create({
  baseURL: "https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp",
});

api.interceptors.request.use((config) => {
  console.log("Request sent:", config);
  return config;
});

export const getMembers = async (): Promise<Member[]> => {
  const response = await api.get<Member[]>("/demande");
  return response.data;
};

export const getMemberById = async (id: number): Promise<Member> => {
  const response = await api.get<Member>(`/demande/${id}`);
  return response.data;
};

export const addMember = async (data: MemberCreate): Promise<Member> => {
  const response = await api.post<Member>("/demande", data);
  return response.data;
};

export const updateMember = async (
  id: number,
  data: MemberUpdate
): Promise<Member> => {
  const response = await api.put<Member>(`/demande/${id}`, data);
  return response.data;
};

export const deleteMember = async (id: number): Promise<void> => {
  await api.delete(`/demande/${id}`);
};