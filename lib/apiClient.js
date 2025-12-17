import axios from 'axios';
axios.defaults.withCredentials = true;
const API_BASE = process.env.next_public_api_url;

const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // include cookies for session (JSESSIONID)
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET request
export const get = async (url) => {
  try {
    const res = await apiClient.get(url);
    console.log('Get Response :',res.status, '|',res.data);
    return {data : res.data, status : res.status};
  } catch (err) {
    console.error('GET error:', err.response?.data || err.message || 'Some Error');
  }
};

// POST request
export const post = async (url, body) => {
  try {
    const res = await apiClient.post(url, body);
    console.log('Post Response :',res.status, ' ',res.data);
    return {data : res.data, status : res.status };
  } catch (err) {
    console.error('POST error:', err.response?.data || err.message);
  }
};

// PUT request
export const put = async (url, body) => {
  try {
    const res = await apiClient.put(url, body);
    console.log('Put Response :',res.status, ' ',res.data);
    return {data : res.data, status : res.status };
  } catch (err) {
    console.error('PUT error:', err.response?.data || err.message);
  }
};

// DELETE request
export const remove = async (url, params = {}) => {
  try {
    const res = await apiClient.delete(url, { params });
    console.log('Delete Response :',res.status, ' ',res.data);
    return {data : res.data, status : res.status };
  } catch (err) {
    console.error('DELETE error:', err.response?.data || err.message);
  }
};

export const getUser = async () => {
  const {data,status} = await get('/user')
  console.log("User Data : ",data);
  if(status === 200 && data != null || ''){
    return {data,status};
  }else{
    return {'account' : null}
  }
}

export default apiClient;
