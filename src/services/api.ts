import axios from "axios";

export const api = axios.create({
    baseURL: "http://179.97.102.202:3333"
})