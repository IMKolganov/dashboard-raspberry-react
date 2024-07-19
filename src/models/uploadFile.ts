import axios from 'axios';

interface UploadFileResponse {
  message: string;
  filePath?: string;
}

export const uploadFile = async (file: File, password: string): Promise<UploadFileResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('password', password);

  const response = await axios.post('/api/uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
