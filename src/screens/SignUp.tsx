import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { VStack, Image, Text, Center, Heading, ScrollView, Alert, useToast } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import axios from 'axios'
import { api } from '@services/api'

import LogoSvg from '@assets/logo.svg'
import BackgroundImg from '@assets/background.png'

import { Input } from '@components/Input'
import { Button } from '@components/Button'
import { useAuth } from '@hooks/useAuth'


type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

const signUpSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o e-mail.').email('E-mail inválido.'),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve conter pelo menos 6 dígitos.'),
  password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação da senha não confere.')
})

//passamos a props dos dados, aqui onde são enviados pro form.
//vamos usar o useForm para acessar o control, passamos o mesmo control para 
//todos inputs pois vão ser controlados pelo mesmo formulário.
//vamos usar o handleSubmit para ele enviar os datas da nossa aplicação. 
export function SignUp() {

  const[isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })
 

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }


  async function handleSignUp({ name, email, password }: FormDataProps) {

    try {
      setIsLoading(true);

      await api.post('/users', { name, email, password }); //1º parâmetro(endpoint) 2º parâmetro(os dados que quero passar pro back-end).
      await signIn(email, password);


    } catch(error) {

      setIsLoading(false);
      if(axios.isAxiosError(error)) {
      Alert(error.response?.data);//se não existir response não exibe o data
    }
  }
}

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <VStack flex={1} px={10} pb={16}>
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie sua conta
          </Heading>

          <Controller //controla o input
            control={control} //controla o valor de cada input
            name="name" 
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Nome"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Confirme a senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />

          <Button
            title="Criar e Acessar"
            onPress={handleSubmit(handleSignUp)} //o handle submit vai passar pro handleSignUp todo conteudo do formulário e tbm para que passe os valores do formulário p/ o handlesignup.
            isLoading={isLoading}
          />

          <Button
            title="Voltar para o login"
            variant={'outline'}
            mt={16}
            onPress={handleGoBack}
          />

        </Center>
      </VStack>
    </ScrollView>
  )

}