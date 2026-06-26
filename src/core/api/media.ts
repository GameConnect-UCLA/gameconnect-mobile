import axios from 'axios'
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

  try {
    const { data } = await apiClient.post<UploadResult>('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
    console.error('Upload status:', error.response.status);
    console.error('Server error data:', JSON.stringify(error.response.data, null, 2));
    console.error('Request data:', error.config?.data);
  }
  
  throw new Error(error.response);

  }

}

export const mediaApi = { uploadFile }
