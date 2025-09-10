import baseApi from '../api'

import type {
  GetEmployeesRequest,
  GetEmployeesResponse,
  AddEmployeeRequest,
  AddEmployeeResponse,
  UpdateEmployeeRequest,
  UpdateEmployeeResponse,
  GetEmployeeResponse,
} from './types'

export const employeeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employees
    getEmployees: builder.query<GetEmployeesResponse, GetEmployeesRequest>({
      query: (params) => ({
        url: '/employee/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['employees'],
    }),

    // Get single employee by ID
    getEmployee: builder.query<GetEmployeeResponse, string>({
      query: (id) => `/employee/get-one/${id}`,
      providesTags: ['employees'],
    }),

    // Add a new employee
    addEmployee: builder.mutation<AddEmployeeResponse, AddEmployeeRequest>({
      query: (body) => ({
        url: '/employee/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['employees'],
    }),

    // Update an employee
    updateEmployee: builder.mutation<
      UpdateEmployeeResponse,
      UpdateEmployeeRequest
    >({
      query: ({ id, body }) => ({
        url: `/employee/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['employees'],
    }),

    // Delete an employee
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employee/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['employees'],
    }),
  }),
})

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useAddEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} = employeeApi
