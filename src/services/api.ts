import { AppError } from "@utils/AppError";
import axios, {AxiosInstance} from "axios";

type signOut = () => void;

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: signOut) => () => void;
}

 const api = axios.create({
    baseURL: "http://179.97.102.202:3333"
});

// api.registerInterceptTokenManager = signOut => {

// }

api.interceptors.response.use(response => response, error => {
    if(error.response && error.response.data) {
        return Promise.reject(new AppError(error.response.data.message));
    } else {
        return Promise.reject(new AppError("Erro no servidor. Tente novamente mais tarde."));
    }
}); 
//se dentro do erro tem uma resposta, e se tem erro no data
//dou return rejeitando a promise, passando um nivi oadrão de mensagem de erro.



export { api };                                                                 