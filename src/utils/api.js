/* eslint-disable linebreak-style */
// Isi file ini sama dengan src/services/api.js,
// kita duplikasi untuk mengikuti struktur awal.
const BASE_URL = 'https://forum-api.dicoding.dev/v1';

async function fetchData(url, method = 'GET', body = null, headers = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  };

  const response = await fetch(`${BASE_URL}${url}`, config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Terjadi kesalahan');
  }
  return await response.json();
}

export default fetchData;
