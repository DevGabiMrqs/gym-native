import React, { useCallback, useState } from 'react'
import { Heading, VStack, SectionList, Text, useToast } from 'native-base'

import { ScreenHeader } from '@components/ScreenHeader'
import { HistoryCard } from '@components/HistoryCard'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { useFocusEffect } from '@react-navigation/native'
import { HistoryDTO } from '@components/History.DTO'
import { HistoryByDayDTO } from '@dtos/HistoryByDay'
import { Loading } from '@components/Loading'


export function History() {

  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

  async function fecthHistory() {
    try {
      setIsLoading(true)

      const response = await api.get('/history');
      setExercises(response.data)

      
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title =  isAppError ? error.message : "Não foi possível carregar o histórico de exercícios."

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      })
    } finally {
      setIsLoading(false);
    }    
  }

  useFocusEffect(useCallback(() => {
    fecthHistory()
  }, [])); 

  return (
    <VStack flex={1}>
      <ScreenHeader title='Histórico de Exercícios' />

      {isLoading ? <Loading /> : (
        <SectionList
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoryCard data={item}/> //o componente history card está recebendo datas e pegando os itens.
          )}
          renderSectionHeader={({ section }) => (
            <Heading fontSize={"md"} color="gray.200" mt={10} mb={3} fontFamily={"heading"}>
              {section.title}
            </Heading>
          )}
          px={8}
          contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: "center"}}
          ListEmptyComponent={() => (
            <Text color={"gray.100"} textAlign={"center"}>
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
        />
      )}
    </VStack>
  )
}