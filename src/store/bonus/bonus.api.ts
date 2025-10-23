import baseApi from '../api'
import type {
  BonusTypeResponse,
  SingleBonusTypeResponse,
  BonusTypeRequest,
  AddBonusTypeResponse,
  AddBonusTypeRequest,
  UpdateBonusTypeRequest,
  UpdateBonusTypeResponse,
  ClientBonusResponse,
  SingleClientBonusResponse,
  ClientBonusRequest,
  AddClientBonusRequest,
  AddClientBonusResponse,
} from '@/types/bonus'

export const BonusApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ==================== BONUS TYPE ====================
    getBonusTypes: build.query<BonusTypeResponse, BonusTypeRequest>({
      query: (params) => ({
        url: '/bonus-type/getAll',
        method: 'GET',
        params,
      }),
      providesTags: ['bonuses'],
    }),
    getOneBonusType: build.query<SingleBonusTypeResponse, string>({
      query: (id) => ({
        url: `/bonus-type/getById/${id}`,
        method: 'GET',
      }),
      providesTags: ['bonuses'],
    }),
    addBonusType: build.mutation<AddBonusTypeResponse, AddBonusTypeRequest>({
      query: (body) => ({
        url: '/bonus-type/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['bonuses'],
    }),
    updateBonusType: build.mutation<
      UpdateBonusTypeResponse,
      UpdateBonusTypeRequest
    >({
      query: ({ id, body }) => ({
        url: `/bonus-type/update/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['bonuses'],
    }),
    deleteBonusType: build.mutation<void, string>({
      query: (id) => ({
        url: `/bonus-type/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['bonuses'],
    }),

    // ==================== CLIENT BONUS ====================
    getClientBonuses: build.query<ClientBonusResponse, ClientBonusRequest>({
      query: (params) => ({
        url: '/bonus/getAll',
        method: 'GET',
        params,
      }),
      providesTags: ['bonuses'],
    }),
    getOneClientBonus: build.query<SingleClientBonusResponse, string>({
      query: (id) => ({
        url: `/bonus/getById/${id}`,
        method: 'GET',
      }),
      providesTags: ['bonuses'],
    }),
    addClientBonus: build.mutation<
      AddClientBonusResponse,
      AddClientBonusRequest
    >({
      query: (body) => ({
        url: '/bonus/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['bonuses', 'clients'],
    }),
    deleteClientBonus: build.mutation<void, string>({
      query: (id) => ({
        url: `/bonus/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['bonuses', 'clients'],
    }),
  }),
})

export const {
  // Bonus Type hooks
  useGetBonusTypesQuery,
  useGetOneBonusTypeQuery,
  useAddBonusTypeMutation,
  useUpdateBonusTypeMutation,
  useDeleteBonusTypeMutation,

  // Client Bonus hooks
  useGetClientBonusesQuery,
  useGetOneClientBonusQuery,
  useAddClientBonusMutation,
  useDeleteClientBonusMutation,
} = BonusApi
