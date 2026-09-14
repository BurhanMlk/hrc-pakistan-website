import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000,
});

/* Attach access token to every request */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrc_access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* Queue a single refresh attempt on 401 */
let refreshPromise = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const isAuthUrl = original?.url?.includes('/auth/login') || original?.url?.includes('/auth/refresh');

    if (status === 401 && !original._retry && !isAuthUrl) {
      original._retry = true;
      const refreshToken = localStorage.getItem('hrc_refresh_token');
      if (refreshToken) {
        try {
          refreshPromise =
            refreshPromise ||
            axios
              .post(`${API_URL}/auth/refresh`, { refreshToken })
              .then((res) => {
                const { accessToken, refreshToken: newRefresh } = res.data.data;
                localStorage.setItem('hrc_access_token', accessToken);
                localStorage.setItem('hrc_refresh_token', newRefresh);
                return accessToken;
              })
              .finally(() => {
                refreshPromise = null;
              });
          const newAccess = await refreshPromise;
          original.headers.Authorization = `Bearer ${newAccess}`;
          return api(original);
        } catch (refreshError) {
          localStorage.removeItem('hrc_access_token');
          localStorage.removeItem('hrc_refresh_token');
          localStorage.removeItem('hrc_user');
          window.location.href = '/admin/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('hrc_access_token');
        localStorage.removeItem('hrc_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

/** Extract a human-readable error message from an API error. */
export function getApiError(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (data?.message) return data.message;
  if (data?.details?.length) return data.details.map((d) => d.message).join(' ');
  return fallback;
}

export function fileUrl(filename) {
  if (!filename) return '';
  if (/^https?:\/\//.test(filename)) return filename;
  return `/uploads/${filename}`;
}

export default api;
