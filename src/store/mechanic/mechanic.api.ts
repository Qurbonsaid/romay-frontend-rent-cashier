import baseApi from '../api'
import type {
  AddMechanicRequest,
  AddMechanicResponse,
  GetAllMechanicsRequest,
  GetAllMechanicsResponse,
} from './types'

export const mechanicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addMechanic: builder.mutation<AddMechanicResponse, AddMechanicRequest>({
      query: (body) => ({
        url: '/mechanic/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['mechanics'],
    }),
    getAllMechanics: builder.query<
      GetAllMechanicsResponse,
      GetAllMechanicsRequest
    >({
      query: ({ search, work_type, branch_id, page, limit } = {}) => ({
        url: '/mechanic/get-all',
        method: 'GET',
        params: {
          ...(search && { search }),
          ...(work_type && { work_type }),
          ...(branch_id && { branch_id }),
          ...(page && { page }),
          ...(limit && { limit }),
        },
      }),
      providesTags: ['mechanics'],
    }),
  }),
})

export const { useAddMechanicMutation, useGetAllMechanicsQuery } = mechanicApi
