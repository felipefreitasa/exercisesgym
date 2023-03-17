import { useCallback, useEffect, useState } from "react"

import { useFocusEffect, useNavigation } from "@react-navigation/native"

import { AppNavigatorRoutesProps } from "@routes/app.routes"

import { api } from "@services/api"
import { ExerciseDTO } from "@dtos/ExerciseDTO"

import { AppError } from "@utils/AppError"

import { VStack, FlatList, HStack, Heading, Text, useToast } from "native-base"

import { HomeHeader } from "@components/HomeHeader"
import { Group } from "@components/Group"
import { ExerciseCard } from "@components/ExerciseCard"
import { Loading } from "@components/Loading"

export function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [groups, setGroups] = useState<string[]>([])
  const [groupSelected, setGroupSelected] = useState('antebraço')
  const [exercises, setExercises] = useState<ExerciseDTO[]>([])

  const toast = useToast()

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  function handleOpenExerciseDetails(exerciseId: string){
    navigation.navigate("exercise", { exerciseId })
  }

  async function fetchGroups(){
    try {
      setIsLoading(true)

      const response = await api.get('/groups')
      setGroups(response.data)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  async function fetchExercisesByGroup(){
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/bygroup/${groupSelected}`)
      setExercises(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    } 
  }

  useEffect(() => {
    fetchGroups()
  }, [])
  
  useFocusEffect(useCallback(() => {
    fetchExercisesByGroup()
  }, [groupSelected]))

  return (
    <VStack flex={1} >
      <HomeHeader />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Group 
            name={item} 
            isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()} 
            onPress={() => setGroupSelected(item)} />
          )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{ px: 4 }}
        my={6}
        maxH={10}
        minH={10}
      />

      {isLoading ? (
        <Loading/>
      ) : (
        <>
          <VStack 
            flex={1} 
            px={4}
          >
            <HStack 
              justifyContent="space-between" 
              mb={4}
            >
              <Heading 
                color="gray.200" 
                fontSize="md"
                fontFamily="heading"
              >
                Exercícios
              </Heading>

              <Text 
                color="gray.200" 
                fontSize="sm"
              >
                {exercises.length}
              </Text>
            </HStack>

            <FlatList
              data={exercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ExerciseCard 
                  onPress={() => handleOpenExerciseDetails(item.id)}
                  data={item}
                />
              )}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{ paddingBottom: 20 }}
            />
          </VStack>
        </>
      )}
    </VStack>
  )
}