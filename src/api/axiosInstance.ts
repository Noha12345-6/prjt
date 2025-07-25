import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://67575d82c0a427baf94c94da.mockapi.io/dev101/ApiDemande/apiphp',
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Tu peux ajouter des headers ici si besoin
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gestion centralisée des erreurs
    return Promise.reject(error);
  }
);

export default axiosInstance; 