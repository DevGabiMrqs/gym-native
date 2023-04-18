import React from "react";
import { ReactNode, createContext } from "react";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
}
//Nesse contexto vamos compartilhar coisas relacionadas a autenticação do usuário.


type AuthContextProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children } : AuthContextProviderProps) {

    return (
        <AuthContext.Provider value={{
            user: {
                id: '1',
                name: 'teste',
                email:'teste@gmail.com',
                avatar:'teste.png',
            }
        }}>
        { children }
        </AuthContext.Provider>
    )
}