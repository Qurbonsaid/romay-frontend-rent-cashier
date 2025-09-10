import baseApi from '../api'
import type {
  AddSupplierRequest,
  AddSupplierResponse,
  DebtPaymentRequest,
  DebtPaymentResponse,
  GetAllDebtPaymentsRequest,
  GetAllDebtPaymentsResponse,
  GetAllSuppliersRequest,
  GetAllSuppliersResponse,
  GetOneSupplierRequest,
  GetOneSupplierResponse,
  RentProductsRequest,
  RentProductsResponse,
  SaleProductRequest,
  SaleProductsResponse,
  UpdateDebtPaymentRequest,
  UpdateDebtPaymentResponse,
  UpdateSupplierRequest,
  UpdateSupplierResponse,
} from './types'

export const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuppliers: builder.query<
      GetAllSuppliersResponse,
      GetAllSuppliersRequest
    >({
      query: (params) => ({
        url: '/supplier/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['suppliers'],
    }),

    addSupplier: builder.mutation<AddSupplierResponse, AddSupplierRequest>({
      query: (body) => ({
        url: '/supplier/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['suppliers'],
    }),

    updateSupplier: builder.mutation<
      UpdateSupplierResponse,
      UpdateSupplierRequest
    >({
      query: ({ id, body }) => ({
        url: `/supplier/update/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['suppliers'],
    }),
    deleteSupplier: builder.mutation<void, string>({
      query: (id) => ({
        url: `/supplier/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['suppliers'],
    }),
    getOneSupplier: builder.query<
      GetOneSupplierResponse,
      GetOneSupplierRequest
    >({
      query: ({ id }) => ({
        url: `/supplier/get/${id}`,
        method: 'GET',
      }),
      providesTags: ['suppliers'],
    }),
    debtPayment: builder.mutation<DebtPaymentResponse, DebtPaymentRequest>({
      query: ({ id, amount }) => ({
        url: `/supplier/${id}/debt-payment`,
        method: 'POST',
        body: { amount },
      }),
      invalidatesTags: ['suppliers'],
    }),
    updateDebtPayment: builder.mutation<
      UpdateDebtPaymentResponse,
      UpdateDebtPaymentRequest
    >({
      query: ({ id, payId, amount }) => ({
        url: `/supplier/${id}/debt-payment/update/${payId}`,
        method: 'PUT',
        body: { amount },
      }),
      invalidatesTags: ['suppliers'],
    }),
    getAllDebtPayments: builder.query<
      GetAllDebtPaymentsResponse,
      GetAllDebtPaymentsRequest
    >({
      query: ({ id }) => ({
        url: `/supplier/${id}/get-all-debt-payment-log`,
        method: 'GET',
      }),
      providesTags: ['suppliers'],
    }),
    saleProducts: builder.query<SaleProductsResponse, SaleProductRequest>({
      query: ({ id }) => ({
        url: '/supplier/sale-products',
        method: 'GET',
        params: { id },
      }),
      providesTags: ['suppliers'],
    }),
    saleProduct: builder.query({
      query: ({ id }) => ({
        url: `/supplier/sale-products/${id}`,
        method: 'GET',
      }),
      providesTags: ['suppliers'],
    }),
    rentProducts: builder.query<RentProductsResponse, RentProductsRequest>({
      query: ({ id }) => ({
        url: '/supplier/rent-products',
        method: 'GET',
        params: { id },
      }),
      providesTags: ['suppliers'],
    }),
    rentProduct: builder.query({
      query: ({ id }) => ({
        url: `/supplier/rent-products/${id}`,
        method: 'GET',
      }),
      providesTags: ['suppliers'],
    }),
  }),
})

export const {
  useGetAllSuppliersQuery,
  useAddSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
  useGetOneSupplierQuery,
  useDebtPaymentMutation,
  useUpdateDebtPaymentMutation,
  useGetAllDebtPaymentsQuery,
  useSaleProductsQuery,
  useRentProductsQuery,
} = supplierApi
