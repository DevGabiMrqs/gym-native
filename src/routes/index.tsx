import { useTheme, Box } from "native-base"
// import { useContext } from "react" //remover
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"

import { AuthRoutes } from "./auth.routes"
import { AppRoutes } from "./app.routes"

import { useAuth } from "@hooks/useAuth"


import React from "react"

export function Routes() {

  // const contextData = useContext(AuthContext);//remover
  
  const { user } = useAuth();
  console.log("Usuário logado =>", user)

  const { colors } = useTheme()
  const theme = DefaultTheme
  theme.colors.background = colors.gray[700]

  return (
    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
        <AuthRoutes />
      </NavigationContainer>
    </Box>
  )
}