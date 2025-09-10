import baseApi from '../api'

import type { UploadFileResponse } from './types'

export const UploadsExtendedEndpoints = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadFile: build.mutation<UploadFileResponse, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: '/upload/file',
          method: 'POST',
          body: formData,
        }
      },
    }),
    publicUploadFile: build.mutation<UploadFileResponse, File>({
      query: (file) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: '/upload/file-public',
          method: 'POST',
          body: formData,
        }
      },
    }),
  }),
})

export const { useUploadFileMutation, usePublicUploadFileMutation } =
  UploadsExtendedEndpoints
