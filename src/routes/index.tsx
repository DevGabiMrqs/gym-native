import { useTheme, Box } from "native-base"
import { NavigationContainer, DefaultTheme } from "@react-navigation/native"

import { AuthRoutes } from "./auth.routes"
import { AppRoutes } from "./app.routes"

import { useAuth } from "@hooks/useAuth"

import React from "react"


export function Routes() {

  const { user } = useAuth();
  const { colors } = useTheme();
  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  return (

    <Box flex={1} bg="gray.700">
      <NavigationContainer theme={theme}>
       { user.id ? <AppRoutes/> : <AuthRoutes />} 
      </NavigationContainer>
    </Box>
  );
}

//Se o usuário possui id ele está logado e vou para AppRoutes. Se não está vou para página de autenticação.