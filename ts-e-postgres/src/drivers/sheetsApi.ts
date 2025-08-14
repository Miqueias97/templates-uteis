import axios from "axios";

const sheetsApi = axios.create({
  baseURL: `https://script.google.com`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default sheetsApi;
