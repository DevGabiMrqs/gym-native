import React, { useEffect } from "react";
import { useState } from "react";
import { ReactNode, createContext } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";
import { storageAuthTokenSave } from '@storage/storageAuthToken'
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

    async function storageUserandToken(userData: UserDTO, token: string) {
       
        try{
            setIsLoadingUserStorage(true)

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`

            await storageUserSave(userData);
            await storageAuthTokenSave(token);
            setUser(userData);

        }catch(error) {
            throw error;

        }finally {
            setIsLoadingUserStorage(false)
        }
    }
    
    async function signIn(email:string, password:string){

        try {

           const { data } = await api.post('./sessions', {email, password}); //quero passar pro Back email e senha, e recuperar a response da back end, posso desetruturar os dados que o back vai retornar.

           if(data.user && data.token){
            setUser(data.user);
            storageUserandToken(data.user, data.token);
           }

       } catch(error) {

           throw error;

       } finally {
        setIsLoadingUserStorage(false);
       }
}

    async function signOut() {
         try{

            setIsLoadingUserStorage(true); //ativando o loading
            setUser({} as UserDTO); //não tem usuário
            storageUserRemove; //importei a função que criei AuthContext e trouxe o contexto de remove dela para cá
            
        }catch(error) {

            throw error;
        }finally {
            setIsLoadingUserStorage(false)
        } 
    }


    async function loadUserData() {

        const userLogged = await storageUserGet();

        try {

            if(userLogged){

                setUser(userLogged);
                setIsLoadingUserStorage(false);
            }
        } catch(error) {

            throw error;
        }
    }
 
    useEffect(() => { //useeffect é executado após a primeira renderização e após cada atualização.
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