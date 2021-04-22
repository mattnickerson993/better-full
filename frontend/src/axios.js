import axios from 'axios';


const baseURL = process.env.NODE_ENV === "development" ? "http://127.0.0.1:8000" : process.env.REACT_APP_API_URL

const axiosAuthInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

axiosAuthInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
	if (originalRequest._retry){
		window.location.reload()
	}
    // Prevent infinite loops
    if (
      error.response.status === 401 &&
      originalRequest.url === '/auth/jwt/refresh/'
    ) {
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized" &&
	  !originalRequest._retry

    ) {
	  originalRequest._retry = true
      const refresh = localStorage.getItem("refresh");

      if (refresh) {
        const tokenParts = JSON.parse(atob(refresh.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);

        if (tokenParts.exp > now) {
          try {
            const response = await axiosAuthInstance.post("/auth/jwt/refresh/", JSON.stringify({
              "refresh": refresh
            }));
            setNewHeaders(response);
            originalRequest.headers["Authorization"] =`JWT ${response.data.access}`
            return axiosAuthInstance(originalRequest);
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          window.location.href = "/login/";
        }
      } else {
        console.log("Refresh token not available.");
        window.location.href = "/login/";
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export function setNewHeaders(response) {
  axiosAuthInstance.defaults.headers["Authorization"] = `JWT ${response.data.access}`;
  localStorage.setItem("access", response.data.access);
//   localStorage.setItem("refresh", response.data.refresh);
}

export default axiosAuthInstance;