import React from "react";
import { useState } from "react";
import { ReactNode, createContext } from "react";
import { UserDTO } from "@dtos/UserDTO";
import { api } from "@services/api";
import { storageUserSave, storageUserGet } from "@storage/storageUser";
import axios from "axios";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

//vamos criar uma estado para guardar as informações do usuário, o estado muda todos os lugares que estiverem usando ele.
//mesmo quando for um objeto vazio, ainda assim existe um padrão. Então devemos tipar, aqui foi passado o DTO.


export function AuthContextProvider({ children } : AuthContextProviderProps) {
    const[user, setUser] = useState<UserDTO>({} as UserDTO);

    //signIn é async, no retorno tem que ser uma promise.
    async function signIn(email:string, password:string){

        try {

           const { data } = await api.post('./sessions', {email, password}); //quero passar pro Back email e senha, e recuperar a response da back end, posso desetruturar os dados que o back vai retornar.

           if(data.user){
            setUser(data.user);
            storageUserSave(data.user);
            storageUserGet();
           }

       } catch(error) {

       throw error;
    }
    }
    //podemos deixar a logica que vai atualizar(useState) nosso contexto aqui no AuthContext


    //Ao invés de compartilharmos o user e setUser, passamos o signIn porque criamos uma função somente para passar esses dados.
    return (
        <AuthContext.Provider value={{ user, signIn }}>
        { children }
        </AuthContext.Provider>
    )
}