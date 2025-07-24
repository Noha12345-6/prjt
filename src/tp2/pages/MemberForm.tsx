// src/components/MemberForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { memberFormSchema} from "../../validation/schema";
import type { MemberFormData } from "../../validation/schema";
import { MemberRoles, MemberStatuses } from "../api/types/member";

interface MemberFormProps {
  initialData?: MemberFormData;
  onSubmit: (data: MemberFormData) => void;
  isSubmitting: boolean;
}

export function MemberForm({ initialData, onSubmit, isSubmitting }: MemberFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MemberFormData>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          {...register("role")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {MemberRoles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700">
          Join Date
        </label>
        <input
          id="joinDate"
          type="date"
          {...register("joinDate")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
        {errors.joinDate && (
          <p className="mt-1 text-sm text-red-600">{errors.joinDate.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          {...register("status")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {MemberStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}