import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/ulr";

export const userApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL }),
  tagTypes: ["User", "TNA", "AuditLog", "Dashboard"],
  endpoints: (builder) => ({
    // Users
    login: builder.mutation({
      query: ({ body }) => ({ url: `login/`, method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: ({ body }) => ({ url: `logout/`, method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    getUsers: builder.query({
      query: (params) => ({ url: "users", params }),
      providesTags: ["User"],
    }),
    getUserStats: builder.query({
      query: () => "users/stats",
      providesTags: ["User"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `users/${id}`, method: "PUT", body }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"],
    }),
    toggleUserStatus: builder.mutation({
      query: (id) => ({ url: `users/${id}/toggle-status`, method: "PATCH" }),
      invalidatesTags: ["User"],
    }),

    // TNAs
    getTNAs: builder.query({
      query: (params) => ({ url: "tnas", params }),
      providesTags: ["TNA"],
    }),
    createTNA: builder.mutation({
      query: (body) => ({ url: "tnas", method: "POST", body }),
      invalidatesTags: ["TNA"],
    }),
    updateTNA: builder.mutation({
      query: ({ id, ...body }) => ({ url: `tnas/${id}`, method: "PUT", body }),
      invalidatesTags: ["TNA"],
    }),
    deleteTNA: builder.mutation({
      query: (id) => ({ url: `tnas/${id}`, method: "DELETE" }),
      invalidatesTags: ["TNA"],
    }),
    getDepartmentProgress: builder.query({
      query: () => "tnas/department-progress",
      providesTags: ["TNA"],
    }),

    // Audit Logs
    getAuditLogs: builder.query({
      query: (params) => ({ url: "audit-logs", params }),
      providesTags: ["AuditLog"],
    }),
    createAuditLog: builder.mutation({
      query: (body) => ({ url: "audit-logs", method: "POST", body }),
      invalidatesTags: ["AuditLog"],
    }),
    exportAuditLogs: builder.query({
      query: () => "audit-logs/export",
      providesTags: ["AuditLog"],
    }),

    // Dashboard
    getDashboardStats: builder.query({
      query: () => "dashboard/stats",
      providesTags: ["Dashboard"],
    }),
    getRecentActivities: builder.query({
      query: () => "dashboard/recent-activities",
      providesTags: ["Dashboard"],
    }),
    getDashboardDepartmentProgress: builder.query({
      query: () => "dashboard/department-progress",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetUsersQuery,
  useGetUserStatsQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useToggleUserStatusMutation,
  useGetTNAsQuery,
  useCreateTNAMutation,
  useUpdateTNAMutation,
  useDeleteTNAMutation,
  useGetDepartmentProgressQuery,
  useGetAuditLogsQuery,
  useCreateAuditLogMutation,
  useExportAuditLogsQuery,
  useGetDashboardStatsQuery,
  useGetRecentActivitiesQuery,
  useGetDashboardDepartmentProgressQuery,
} = userApi;
