import axios from 'axios';

const BASE_URL = 'https://youtube-search-and-download.p.rapidapi.com';

const options = {  
    baseURL: BASE_URL,
    headers: {
        'X-RapidAPI-Key': import.meta.env.VITE_API_URL,
        'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com',
        'Accept': 'application/json'
    }
};

export default axios.create(options);