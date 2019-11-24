import axios from 'axios';

export default axios.create({
    baseURL: 'https://labroz.herokuapp.com/',
    timeout: 300000,
});
