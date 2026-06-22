import { apiClient } from './client'

export interface UploadResult {
  url: string
}

export const uploadFile = async (fileUri: string, fileName: string, mimeType: string): Promise<UploadResult> => {
  const formData = new FormData()
  formData.append('file', {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any)

  const { data } = await apiClient.post<UploadResult>('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

export const mediaApi = { uploadFile }
