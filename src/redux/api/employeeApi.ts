import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "@/config/urls";

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${url.BASE_URL}/employee`,
    credentials: "include",
  }),
  tagTypes: ["Employee", , "EmployeeList"],
  endpoints: (builder) => ({
    createEmployee: builder.mutation({
      query: (body) => ({ url: "create-employee", method: "POST", body }),
      invalidatesTags: ["EmployeeList"],
    }),
    getEmployees: builder.query({
      query: ({ page = 1, search = "", department = "" }) => {
        // <- Destructure all params
        let url = `employees?page=${page}`;
        if (search) {
          url += `&search=${encodeURIComponent(search)}`; // URL-encode to handle special chars
        }
        if (department) {
          url += `&department=${encodeURIComponent(department)}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["EmployeeList"],
    }),
    updateEmployeeStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `employee/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Employee", "EmployeeList"],
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetEmployeesQuery,
  useUpdateEmployeeStatusMutation,
} = employeeApi;
