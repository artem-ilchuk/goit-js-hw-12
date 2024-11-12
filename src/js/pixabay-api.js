import { warningMessage } from './render-functions.js';
import axios from 'axios';

export async function serviceImg(query, page = 1) {
  const API_KEY = '46906317-bfa2c9d7c6708063f650b6890';
  const BASE_URL = 'https://pixabay.com/api/';

  try {
    const result = await axios(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: query,
        page,
        per_page: 15,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return result.data;
  } catch (error) {
    warningMessage();
    throw new Error(error.statusText);
  }
}
