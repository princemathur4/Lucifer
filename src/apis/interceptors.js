// import axios from "axios";

// axios.interceptors.response.use((response) => {
//     return response;
// }, error => {
//     let err;
//     if (error.hasOwnProperty("response")) {
//         console.log("interceptor", error.response)
//         err = error.response;
//     } else {
//         err = error;
//     }
//     return Promise.reject(err);
// });