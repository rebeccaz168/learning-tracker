import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const fetchNote = async () => {
  const response = await api.get(`/topic`);
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

export const createNote = async (title: string, reflection: string, topic_name: string) => {
  const response = await api.post('/topic', {
    title,
    reflection,
    topic_name,
  });
  return response.data;
};

export const createBookmark = async(title : string, noteId: string, topicId : string, folderId: string) => {
  const response = await api.post(`/topic/${topicId}/bookmarks`, {
    title,
    noteId,
    folderId
  });
  
  return response.data; 
}

export const fetchBookmark = async (topicId?: string) => {
  const response = await api.get(`/topic/${topicId}/bookmarks`);
  return response.data;
};9

// post request to fetch summary 
export const fetchSummary = async ( combinedAnswers: string, transcriptId?: string) => {
    const response = await api.post(`/transcript/${transcriptId}/summary`, { combinedAnswers });
    return response.data; 
};
