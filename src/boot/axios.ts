import axios from 'axios';

const api = axios.create({ baseURL: 'https://t4m-test-default-rtdb.firebaseio.com' });

export { api };
