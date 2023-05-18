import { AppError } from "@utils/AppError";
import axios, {AxiosInstance} from "axios";

type signOut = () => void;

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: signOut) => () => void;
}

 const api = axios.create({
    baseURL: "http://179.97.102.202:3333",
}) as APIInstanceProps;

api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = api.interceptors.response.use(response => response, requestError => {
        if(requestError?.response.status === 401) {
            if(requestError.response.data.message === "token.expired" || requestError.response.data?.message === "token.invalid") {
                
            }
            signOut(); //se o problema não está direcionado com o token o usuário é deslogado.Para começar a autenticação novamente.Com token atualizado.
            // mas se é um erro ao token inválido então buscaremos um token novo pro usuário.
        };

        
        if(requestError.response && requestError.response.data) {
            return Promise.reject(new AppError(requestError.response.data.message));
        } else {
            return Promise.reject(requestError);
        }
    });

        return () => {
        api.interceptors.response.eject(interceptTokenManager)
    };
};

export { api };                                                                 