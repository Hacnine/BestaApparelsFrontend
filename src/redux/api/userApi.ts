import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/user/`,
    credentials: "include",
  }),
  tagTypes: ["User", "Get User", "AuditLog", "Dashboard"],
  endpoints: (builder) => ({
    // Users
    login: builder.mutation({
      query: ({ body }) => ({ url: `login/`, method: "POST", body }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: `logout/`, method: "POST" }),
      invalidatesTags: ["User"],
    }),
    userInfo: builder.query({
      query: (body) => ({ url: `user-info/`, method: "GET", body }),
    }),
    getUsers: builder.query({
      query: (params) => ({ url: "users/", params }),
      providesTags: ["Get User"],
    }),
    getUserStats: builder.query({
      query: () => "/stats",
      providesTags: ["Get User"],
    }),
    createUser: builder.mutation({
      query: (body) => ({ url: "create-user", method: "POST", body }),
      invalidatesTags: ["Get User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...body }) => ({ url: `update/${id}`, method: "PUT", body }),
      invalidatesTags: ["Get User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `delete/${id}`, method: "DELETE" }),
      invalidatesTags: ["Get User"],
    }),
    toggleUserStatus: builder.mutation({
      query: (id) => ({ url: `users/${id}/toggle-status`, method: "PATCH" }),
      invalidatesTags: ["Get User"],
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
