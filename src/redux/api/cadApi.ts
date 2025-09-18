import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import ulr from "@/config/urls";

export const cadApi = createApi({
  reducerPath: "cadApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${ulr.BASE_URL}/cad`,
  }),
  tagTypes: ["Cad", "SampleDevelopment", "FabricBooking"],
  endpoints: (builder) => ({
    createCadApproval: builder.mutation({
      query: (body) => ({ url: "cad-approval", method: "POST", body }),
      invalidatesTags: ["Cad"],
    }),

    createSampleDevelopment: builder.mutation({
      query: (body) => ({ url: "sample-development", method: "POST", body }),
      invalidatesTags: ["SampleDevelopment"],
    }),

    createFabricBooking: builder.mutation({
      query: (body) => ({ url: "fabric-booking", method: "POST", body }),
      invalidatesTags: ["FabricBooking"],
    })
  }),
});

export const {
  useCreateCadApprovalMutation,
  useCreateSampleDevelopmentMutation,
  useCreateFabricBookingMutation
} = cadApi;
