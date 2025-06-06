import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const sendTrack = async (data: {
  trackTitle: string;
  initialMessage?: string;
}) => {
  const response = await axios.post(`${BASE_URL}`, {
    producerId: process.env.NEXT_PUBLIC_PRODUCER_ID,
    djId: process.env.NEXT_PUBLIC_DJ_ID,
    ...data
  });
  return response.data;
};

export const getAllTracks = async () => {
  const response = await axios.get(`${BASE_URL}/getAllTracks`);
  return response.data;
};

export const getMessages = async (submissionId: string) => {
  const response = await axios.get(`${BASE_URL}/getMessages/${submissionId}`);
  return response.data;
};

export const sendFeedback = async (
  submissionId: string,
  content: string
) => {
  const response = await axios.post(`${BASE_URL}/feedback/${submissionId}`, {
    djId: process.env.NEXT_PUBLIC_DJ_ID,
    producerId: process.env.NEXT_PUBLIC_PRODUCER_ID,
    content
  });
  return response.data;
};

export const markAsRead = async (submissionId: string) => {
  const response = await axios.put(`${BASE_URL}/read/${submissionId}`);
  return response.data;
};
