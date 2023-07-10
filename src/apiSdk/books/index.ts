import axios from 'axios';
import queryString from 'query-string';
import { BookInterface, BookGetQueryInterface } from 'interfaces/book';
import { GetQueryInterface } from '../../interfaces';

export const getBooks = async (query?: BookGetQueryInterface) => {
  const response = await axios.get(`/api/books${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBook = async (book: BookInterface) => {
  const response = await axios.post('/api/books', book);
  return response.data;
};

export const updateBookById = async (id: string, book: BookInterface) => {
  const response = await axios.put(`/api/books/${id}`, book);
  return response.data;
};

export const getBookById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/books/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBookById = async (id: string) => {
  const response = await axios.delete(`/api/books/${id}`);
  return response.data;
};
