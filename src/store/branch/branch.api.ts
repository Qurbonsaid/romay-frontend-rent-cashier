import baseApi from '../api'
import type {
  AddBranchResponse,
  AddBranchRequest,
  UpdateBranchResponse,
  UpdateBranchRequest,
  GetBranchesResponse,
  GetBranchesRequest,
  GetBranchResponse,
  GetBranchRequest,
} from './types'

export const branchApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBranch: builder.mutation<AddBranchResponse, AddBranchRequest>({
      query: (body) => ({
        url: '/branch/add',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['branches'],
    }),
    updateBranch: builder.mutation<UpdateBranchResponse, UpdateBranchRequest>({
      query: ({ id, body }) => ({
        url: `/branch/update/${id}`,
        method: 'PUT',
        body: body,
      }),
      invalidatesTags: ['branches'],
    }),
    getAllBranches: builder.query<GetBranchesResponse, GetBranchesRequest>({
      query: ({ search, page, limit }) => ({
        url: '/branch/get-all',
        method: 'GET',
        params: {
          search,
          page,
          limit,
        },
      }),
      providesTags: ['branches'],
    }),
    getBranch: builder.query<GetBranchResponse, GetBranchRequest>({
      query: ({ id }) => ({
        url: `/branch/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['branches'],
    }),
    deleteBranch: builder.mutation<void, string>({
      query: (id) => ({
        url: `/branch/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['branches'],
    }),
  }),
})

export const {
  useAddBranchMutation,
  useUpdateBranchMutation,
  useGetAllBranchesQuery,
  useGetBranchQuery,
  useDeleteBranchMutation,
} = branchApi
