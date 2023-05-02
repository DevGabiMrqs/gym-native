import React, { useEffect } from "react";
import { useState } from "react";
import { ReactNode, createContext } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken'
import axios from "axios";
import { AUTH_TOKEN_STORAGE } from "@storage/storageConfig";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: () => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

//vamos criar um estado para guardar as informações do usuário, o estado muda todos os lugares que estiverem usando ele,
//mesmo quando for um objeto vazio, ainda assim existe um padrão. Então devemos tipar, aqui foi passado o DTO.

export function AuthContextProvider({ children } : AuthContextProviderProps) {
    const[user, setUser] = useState<UserDTO>({} as UserDTO);
    const[isLoadingUserStorageData, setIsLoadingUserStorage] = useState(true);



    async function userAndTokenUpdate(userData: UserDTO, token: string) {
       
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(userData);

    }
    
    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try{
            setIsLoadingUserStorage(true);

            await storageUserSave(userData);
            await storageAuthTokenSave(token);

        } catch(error) {
            throw error;
        } finally {
            setIsLoadingUserStorage(false)
        }
    }


    async function signIn(email:string, password:string){ //quando o usuário faz autentication no signIn...
        try {

           const { data } = await api.post('./sessions', {email, password}); //quero passar pro Back email e senha, e recuperar a response da back end, posso desetruturar os dados que o back vai retornar.

           if(data.user && data.token){
            await storageUserAndTokenSave(data.user, data.token); //...nós armazenamos o dado do usuário no dispositivo.
            userAndTokenUpdate(data.user, data.token);
           }
       } catch(error) {
           throw error;
       } finally {
        setIsLoadingUserStorage(false);
       }
}

    async function signOut() {//no signOut removemos o usuário e o token
         try{

            setIsLoadingUserStorage(true); 

            setUser({} as UserDTO); //não tem usuário
            await storageUserRemove(); //importei a função que criei AuthContext e trouxe o contexto de remove dela para cá
            await storageAuthTokenRemove();

        }catch(error) {
            throw error;
        }finally {
            setIsLoadingUserStorage(false)
        } 
    }


    async function loadUserData() {

        try {
        setIsLoadingUserStorage(true);

        const userLogged = await storageUserGet();
        const token = await storageAuthTokenGet();

            if(token && userLogged){
                userAndTokenUpdate(userLogged, token);
            }
        } catch(error) {
            throw error;
        } finally {
            setIsLoadingUserStorage(false);
        }
    }
 
    useEffect(() => { //useeffect é executado após a primeira renderização e depois a cada atualização.
        loadUserData();
    }, [])

    return (
        <AuthContext.Provider value={{ 
                user, 
                signIn,
                signOut,
                isLoadingUserStorageData,
            }}>
        { children }
        </AuthContext.Provider>
    )
}