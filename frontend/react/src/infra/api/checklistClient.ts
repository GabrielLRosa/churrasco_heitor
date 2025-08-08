import axios from 'axios';
import { API_BASE_URL } from '../../shared/constants';

const checklistClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});


// Podem ser usados também para a configuração de algum serviço de monitoramento,
// como esse projeto react será servido pelo php após o build
// ao invés de configurar algum serviço de log que rode no servidor
// é mais indicado utilizar algum serviço como dataDog ou Sentry.
// Por esse motivo deixarei apenas os logs de console.
checklistClient.interceptors.request.use(
  (config) => {
    // Se necessário, adicionar headers e tokens de autenticação
    console.log(`🚀 Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

checklistClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.message);
    return Promise.reject(error);
  }
);

export default checklistClient;