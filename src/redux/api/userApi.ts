import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/user`,
    credentials: "include",
  }),
  tagTypes: ["User", "TNA", "AuditLog", "Dashboard"],
  endpoints: (builder) => ({
    // Users
    login: builder.mutation({
      query: ({ body }) => ({ url: `login/`, method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation({
      query: () => ({ url: `logout/`, method: "POST" }),
      invalidatesTags: ["User"],
    }),
    userInfo: builder.query({
      query: (body) => ({ url: `user-info/`, method: "GET", body }),
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
} = userApi;
