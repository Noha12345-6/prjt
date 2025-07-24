// src/hooks/useMembers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "./../members";
import {  type Member,  type MemberCreate, type MemberUpdate } from "../types/member";

export const useMembers = () => {
  return useQuery<Member[]>({
    queryKey: ["members"],
    queryFn: api.getMembers,
  });
};

export const useMemberById = (id: number) => {
  return useQuery<Member>({
    queryKey: ["members", id],
    queryFn: () => api.getMemberById(id),
    enabled: !!id, // Only fetch if id exists
  });
};

export const useAddMember = () => {
  const client = useQueryClient();
  return useMutation<Member, Error, MemberCreate>({
    mutationFn: api.addMember,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["members"] });
    },
  });
};

export const useUpdateMember = () => {
  const client = useQueryClient();
  return useMutation<Member, Error, { id: number; data: MemberUpdate }>({
    mutationFn: ({ id, data }) => api.updateMember(id, data),
    onSuccess: (updatedMember) => {
      client.invalidateQueries({ queryKey: ["members"] });
      client.setQueryData(["members", updatedMember.id], updatedMember);
    },
  });
};

export const useDeleteMember = () => {
  const client = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: api.deleteMember,
    onSuccess: (_, id) => {
      client.invalidateQueries({ queryKey: ["members"] });
      client.removeQueries({ queryKey: ["members", id] });
    },
  });
};