import React, { useState, useEffect, useCallback } from 'react'
import { VStack, FlatList, HStack, Heading, Text, useToast } from 'native-base'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { AppNavigatorRoutesProp } from '@routes/app.routes'

import { HomeHeader } from '@components/HomeHeader'
import { Group } from '@components/Group'
import { ExerciseCard } from '@components/ExerciseCard'

import { api } from '@services/api'
import { AppError } from '@utils/AppError'

import { ExerciseDTO } from '@dtos/Exercise.DTO'
import { Loading } from '@components/Loading'


export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [groups, setGroups] = useState<string[]>([]);
  const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
  const [groupSelected, setGroupSelected] = useState('antebraço');

  const toast = useToast(); 
  const navigation = useNavigation<AppNavigatorRoutesProp>()

  function handleOpenExerciseDetails(exerciseId: string){ //vou pegar o id do exercício para quando acessar ele aparecer completo e ser possível marcar como realizado
    navigation.navigate('exercise', {exerciseId})
  }

  async function fecthGroups() {
    try {

      const response = await api.get('/groups');
      setGroups(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível carregar os grupos musculares.";

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } 
  }


  useEffect(() => {
    fecthGroups();
  }, [])


  async function fecthExerciseByGroup() {
    try {
      
      setIsLoading(true)

      const response = await api.get(`exercises/bygroup/${groupSelected}`);//entre literal `` pq será acessado o id dentro de exercise. 
      setExercises(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : "Não foi possível carregar os exercícios.";
      
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    
    fecthGroups();

  },[])


  useFocusEffect(useCallback(() => {

    fecthExerciseByGroup();

  }, [groupSelected]))
//focusEffect é usado sempre q a tela home tiver o foco, para renderizar a função.
//useCallBack anota a função para não repetir de forma desnecessária.
//no array de dependências todas vezes que o groupSelect mudar ele vai disparar a busca pelo exercício.


  return (
    <VStack flex={1}>

      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <Group
            name={item}
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 8 }}
        my={10}
        maxH={10}
        minH={10}
      />
      
        {

          isLoading
          ? <Loading/> 
          : <VStack flex={1} px={8}>
        <HStack justifyContent={'space-between'} mb={5}>
          <Heading color="gray.200" fontSize={"md"} fontFamily={"heading"}>
            Exercícios
          </Heading>

          <Text color="gray.200" fontSize={"sm"}>
            {exercises.length}
          </Text>
        </HStack>


        <FlatList
          data={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ExerciseCard 
            onPress={() => handleOpenExerciseDetails(item.id)}
            data={item}
            />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20}}
            />

            </VStack>

        }   

    </VStack>
  )
}