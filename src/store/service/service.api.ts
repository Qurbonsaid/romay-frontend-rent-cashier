import baseApi from '../api'
import type {
  AddServiceRequest,
  AddServiceResponse,
  GetAllServicesRequest,
  GetAllServicesResponse,
  GetServiceResponse,
  UpdateServiceRequest,
  UpdateServiceResponse,
  DeleteServiceResponse,
} from './types'

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation<AddServiceResponse, AddServiceRequest>({
      query: (body) => ({
        url: '/service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['services', 'products'],
    }),
    getAllServices: builder.query<
      GetAllServicesResponse,
      GetAllServicesRequest
    >({
      query: ({ status, search, branch, mechanic, page, limit } = {}) => ({
        url: '/service/get-all',
        method: 'GET',
        params: {
          ...(status && { status }),
          ...(search && { search }),
          ...(branch && { branch }),
          ...(mechanic && { mechanic }),
          ...(page && { page }),
          ...(limit && { limit }),
        },
      }),
      providesTags: ['services'],
    }),
    getService: builder.query<
      GetServiceResponse,
      { id: string; branch?: string }
    >({
      query: ({ id, branch }) => ({
        url: `/service/get/${id}`,
        method: 'GET',
        params: {
          ...(branch && { branch }),
        },
      }),
      providesTags: ['services'],
    }),
    updateService: builder.mutation<
      UpdateServiceResponse,
      { id: string; data: UpdateServiceRequest }
    >({
      query: ({ id, data }) => ({
        url: `/service/update/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['services', 'products'],
    }),
    deleteService: builder.mutation<DeleteServiceResponse, string>({
      query: (id) => ({
        url: `/service/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['services', 'products'],
    }),
    cancelService: builder.mutation<UpdateServiceResponse, string>({
      query: (id) => ({
        url: `/service/cancel/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['services', 'products'],
    }),
    completeService: builder.mutation<
      UpdateServiceResponse,
      { id: string; payments: any[] }
    >({
      query: ({ id, payments }) => ({
        url: `/service/complete/${id}`,
        method: 'PUT',
        body: { payments },
      }),
      invalidatesTags: ['services', 'products'],
    }),
  }),
})

export const {
  useAddServiceMutation,
  useGetAllServicesQuery,
  useGetServiceQuery,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useCancelServiceMutation,
  useCompleteServiceMutation,
} = serviceApi
