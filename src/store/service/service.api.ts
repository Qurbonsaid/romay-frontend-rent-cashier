import baseApi from '../api'
import type {
  AddServiceRequest,
  AddServiceResponse,
  GetAllServicesRequest,
  GetAllServicesResponse,
} from './types'

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addService: builder.mutation<AddServiceResponse, AddServiceRequest>({
      query: (body) => ({
        url: '/service/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['services'],
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
  }),
})

export const { useAddServiceMutation, useGetAllServicesQuery } = serviceApi
