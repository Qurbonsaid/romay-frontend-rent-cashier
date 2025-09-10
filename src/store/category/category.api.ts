import baseApi from '../api'
import type { GetAllCategoryRequest, GetAllCategoryResponse } from './types'

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategory: builder.query<
      GetAllCategoryResponse,
      GetAllCategoryRequest
    >({
      query: (params) => ({
        url: '/category/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['products'],
    }),
  }),
})

export const { useGetAllCategoryQuery } = categoryApi
