import baseApi from '../api'
import type {
  AddRentRequest,
  AddRentResponse,
  GetAllRentsRequest,
  GetAllRentsResponse,
  GetRentResponse,
  UpdateRentRequest,
  CompleteRentRequest,
  UpdateDeliveryDateRequest,
  GenericResponse,
  GetAllRentProductsRequest,
  GetAllRentProductsResponse,
  GetRentProductResponse,
  GetDetailedRentProductResponse,
} from './types'

export const rentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Rent operations
    addRent: builder.mutation<AddRentResponse, AddRentRequest>({
      query: (body) => ({
        url: '/rent/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['rents'],
    }),

    updateRent: builder.mutation<
      GenericResponse,
      { id: string; data: UpdateRentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/rent/update/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['rents'],
    }),

    updateDeliveryDate: builder.mutation<
      GenericResponse,
      { id: string; data: UpdateDeliveryDateRequest }
    >({
      query: ({ id, data }) => ({
        url: `/rent/update-delivery-date/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['rents'],
    }),

    completeRent: builder.mutation<
      GenericResponse,
      { id: string; data: CompleteRentRequest }
    >({
      query: ({ id, data }) => ({
        url: `/rent/complete/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['rents'],
    }),

    cancelRent: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/rent/cancel/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['rents'],
    }),

    getAllRents: builder.query<GetAllRentsResponse, GetAllRentsRequest>({
      query: ({ branch, client, status, search, page, limit } = {}) => ({
        url: '/rent/get-all',
        method: 'GET',
        params: {
          ...(branch && { branch }),
          ...(client && { client }),
          ...(status && { status }),
          ...(search && { search }),
          ...(page && { page }),
          ...(limit && { limit }),
        },
      }),
      providesTags: ['rents'],
    }),

    getRent: builder.query<GetRentResponse, string>({
      query: (id) => ({
        url: `/rent/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['rents'],
    }),

    deleteRent: builder.mutation<GenericResponse, string>({
      query: (id) => ({
        url: `/rent/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['rents'],
    }),

    // Rent Product operations
    getAllRentProducts: builder.query<
      GetAllRentProductsResponse,
      GetAllRentProductsRequest
    >({
      query: ({ search, page, limit } = {}) => ({
        url: '/product/rent-product/get-all',
        method: 'GET',
        params: {
          ...(search && { search }),
          ...(page && { page }),
          ...(limit && { limit }),
        },
      }),
      providesTags: ['rentProducts'],
    }),

    getRentProduct: builder.query<GetRentProductResponse, string>({
      query: (id) => ({
        url: `/product/rent-product/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['rentProducts'],
    }),

    getDetailedRentProduct: builder.query<
      GetDetailedRentProductResponse,
      string
    >({
      query: (id) => ({
        url: `/product/rent-product/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['rentProducts'],
    }),

    getRentProductByBarcode: builder.query<GetRentProductResponse, string>({
      query: (barcode) => ({
        url: `/product/rent-product/barcode/${barcode}`,
        method: 'GET',
      }),
      providesTags: ['rentProducts'],
    }),
  }),
})

export const {
  useAddRentMutation,
  useUpdateRentMutation,
  useUpdateDeliveryDateMutation,
  useCompleteRentMutation,
  useCancelRentMutation,
  useGetAllRentsQuery,
  useGetRentQuery,
  useDeleteRentMutation,
  useGetAllRentProductsQuery,
  useGetRentProductQuery,
  useGetDetailedRentProductQuery,
  useGetRentProductByBarcodeQuery,
} = rentApi
