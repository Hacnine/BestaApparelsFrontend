import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const cadApi = createApi({
  reducerPath: "cadApi",
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${ulr.BASE_URL}/cad` }),
  tagTypes: [ "Cad"],
  endpoints: (builder) => ({

    createCadApproval: builder.mutation({
      query: (body) => ({ url: "cad-approval", method: "POST", body }),
      invalidatesTags: ["Cad"],
    }),
   
   
  }),
});

export const {
  useCreateCadApprovalMutation,
} = cadApi;
