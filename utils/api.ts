import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const fetchNote = async () => {
  const response = await api.get(`/note`);
  return response.data;
};

export const fetchFolder = async () => {
  const response = await api.get(`/folder`); 
  return response.data; 
}

export const createFolder = async (name: string) => {
  const response = await api.post('/folder', { name });
  return response.data;
};

export const createBookmark = async(title : string, transcriptQId: string, transcriptId : string, folderId: string) => {
  const response = await api.post(`/transcript/${transcriptId}/bookmarks`, {
    title,
    transcriptQId,
    folderId
  });
  
  return response.data; 
}

// eventually perhaps filter based on transcriptId 
export const fetchBookmark = async (transcriptId?: string) => {
  const response = await api.get(`/transcript/${transcriptId}/bookmarks`);
  return response.data;
};

// post request to fetch summary 
export const fetchSummary = async ( combinedAnswers: string, transcriptId?: string) => {
    const response = await api.post(`/transcript/${transcriptId}/summary`, { combinedAnswers });
    return response.data; 
};
