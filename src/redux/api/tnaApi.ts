import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const tnaApi = createApi({
  reducerPath: "tnaApi",
  baseQuery: fetchBaseQuery({ baseUrl: ulr.BASE_URL }),
  tagTypes: ["User", "TNA", "AuditLog", "Dashboard"],
  endpoints: (builder) => ({

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
   
  }),
});

export const {
  useGetTNAsQuery,
  useCreateTNAMutation,
  useUpdateTNAMutation,
  useDeleteTNAMutation,
  useGetDepartmentProgressQuery,
} = tnaApi;
