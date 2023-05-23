import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, {AxiosInstance, AxiosError} from "axios";

type signOut = () => void;

type PromiseType = {
    onSuccess: (token: string) => void;
    onFailure: (error: AxiosError) => void;
}; 
//promise pras req que estão em fila, podemos processar elas com novo token ou com erro.

type APIInstanceProps = AxiosInstance & {
    registerInterceptTokenManager: (signOut: signOut) => () => void;
}

const api = axios.create({
    baseURL: "http://179.97.102.202:3333",
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = signOut => {
    const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {
        if(requestError?.response.status === 401) {
            if(requestError.response.data.message === "token.expired" || requestError.response.data?.message === "token.invalid") {
                const { refresh_token } = await storageAuthTokenGet(); //recuperamos o refreshtoken que está armazenado no dispositivo.

                if(!refresh_token){ //se não existir  refresh token desloga o user
                    signOut();

                    return Promise.reject(requestError)
                }

                const originalRequestConfig = requestError.config;

                if(isRefreshing){
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                        onSuccess: (token: string) => {
                            originalRequestConfig.headers = {'Authorization': `Bearer ${token}`};
                            resolve(api(originalRequestConfig))
                        },
                        onFailure: (error: AxiosError) => {
                        reject(error);
                        },
                        })
                    });
                }
                isRefreshing = true;

                return new Promise(async(resolve, reject) => {
                    try {

                        const { data } = await api.post('/sessions/refresh-token', {refresh_token}) //estou enviando o token.
                        await storageAuthTokenSave({token: data.token, refresh_token: data.refreshtoken})

                        if(originalRequestConfig.data){
                            originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
                        }
                        originalRequestConfig.headers = {'Authorization': `Bearer ${data.token}`};
                        api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

                        failedQueue.forEach(request => {
                            request.onSuccess(data.token);
                        });

                        console.log("TOKEN ATUALIZADO");

                        resolve(api(originalRequestConfig));

                    } catch (error: any) {
                        failedQueue.forEach(request => {
                            request.onFailure(error)
                        });

                        signOut();
                        reject(error);
                        
                    } finally {
                        isRefreshing = false;
                        failedQueue = [];
                    }
                });
            }
            signOut(); 
            //se o problema não está direcionado com o token o usuário é deslogado.Para começar a autenticação novamente.Com token atualizado.
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