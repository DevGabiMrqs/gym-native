import React, { useState } from "react";
import { ReactNode, createContext } from "react";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => void;
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);



export function AuthContextProvider({ children } : AuthContextProviderProps) {

    const[user, setUser] = useState({
        id: '1',
        name: 'teste',
        email:'teste@gmail.com',
        avatar:'teste.png',
    });
    //vamos criar uma estado para guardar as informações do usuário, o estado muda todos os lugares que estiverem usando ele.


    function signIn(email:string, password:string){
        setUser({
            id: '',
            name:'',
            email,
            avatar: '',
          }) 
    }
    //podemos deixar a logica que vai atualizar(useState) nosso contexto aqui no AuthContext


    //Ao invés de compartilharmos o user e setUser, passamos o signIn porque criamos uma função somente para passar esses dados.
    return (
        <AuthContext.Provider value={{ user, signIn }}>
        { children }
        </AuthContext.Provider>
    )
}