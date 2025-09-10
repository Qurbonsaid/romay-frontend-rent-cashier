import baseApi from '../api'
import type {
  ClientResponse,
  ClientRequest,
  AddClientResponse,
  AddClientRequest,
  UpdateClientRequest,
  UpdateClientResponse,
} from './types'

export const ClientsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getClients: build.query<ClientResponse, ClientRequest>({
      query: (params) => ({
        url: '/client/get-all',
        method: 'GET',
        params,
      }),
      providesTags: ['clients'],
    }),
    addClient: build.mutation<AddClientResponse, AddClientRequest>({
      query: (body) => ({
        url: '/client/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['clients'],
    }),
    updateClient: build.mutation<UpdateClientResponse, UpdateClientRequest>({
      query: ({ id, body }) => ({
        url: `/client/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['clients'],
    }),
    deleteClient: build.mutation<void, string>({
      query: (id) => ({
        url: `/client/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['clients'],
    }),
    getOneClient: build.query<ClientResponse, string>({
      query: (id) => ({
        url: `/client/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['clients'],
    }),
  }),
})

export const {
  useGetClientsQuery,
  useAddClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useGetOneClientQuery,
} = ClientsApi
