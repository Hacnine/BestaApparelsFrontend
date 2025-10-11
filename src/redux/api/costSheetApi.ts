import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const costSheetApi = createApi({
  reducerPath: "costSheetApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/cost-sheets`,
    credentials: "include",
  }),
  
  tagTypes: ["CostSheet"],
  endpoints: (builder) => ({
    getCostSheets: builder.query<any[], void>({
      query: () => "/",
      providesTags: ["CostSheet"],
    }),
    getCostSheet: builder.query<any, number>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "CostSheet", id }],
    }),
    createCostSheet: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CostSheet"],
    }),
    updateCostSheet: builder.mutation<any, { id: number; data: Partial<any> }>({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "CostSheet", id }],
    }),
    deleteCostSheet: builder.mutation<any, number>({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CostSheet"],
    }),
  }),
});

export const {
  useGetCostSheetsQuery,
  useGetCostSheetQuery,
  useCreateCostSheetMutation,
  useUpdateCostSheetMutation,
  useDeleteCostSheetMutation,
} = costSheetApi;
