import baseApi from '../api'
import type {
  GetAllProductsResponse,
  GetAllProductsRequest,
  CreateProductRequest,
  CreateProductResponse,
} from './types'

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<
      GetAllProductsResponse,
      GetAllProductsRequest
    >({
      query: (params) => ({
        url: '/warehouse/sale-product/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['products'],
    }),
    // New endpoint for sale products
    getAllSaleProducts: builder.query<
      GetAllProductsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: '/product/sale-product/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['products'],
    }),
    // New endpoint for rent products
    getAllRentProducts: builder.query<
      GetAllProductsResponse,
      { page?: number; limit?: number; search?: string }
    >({
      query: (params) => ({
        url: '/product/rent-product/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['products'],
    }),
    createProduct: builder.mutation<
      CreateProductResponse,
      CreateProductRequest
    >({
      query: (body) => ({
        url: '/warehouse/sale-product/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['products'],
    }),
  }),
})

export const {
  useGetAllProductsQuery,
  useGetAllSaleProductsQuery,
  useGetAllRentProductsQuery,
  useCreateProductMutation,
} = productApi
