import { useEffect, useState } from "react"
import { TouchableOpacity } from "react-native"

import { useNavigation, useRoute } from "@react-navigation/native"
import { AppNavigatorRoutesProps } from "@routes/app.routes"

import { AppError } from "@utils/AppError"

import { api } from "@services/api"
import { ExerciseDTO } from "@dtos/ExerciseDTO"

import { Box, Heading, HStack, Icon, Image, ScrollView, Text, useToast, VStack } from "native-base"

import { Feather } from "@expo/vector-icons"

import BodySvg from "@assets/body.svg"
import SeriesSvg from "@assets/series.svg"
import RepetitionsSvg from "@assets/repetitions.svg"

import { Button } from "@components/Button"
import { Loading } from "@components/Loading"

type RouteParamsProps = {
  exerciseId: string
}

export function Exercise() {
  const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)
  const [isLoading, setIsLoading] = useState(true)
  const [submitingRegister, setSubmitingRegister] = useState(false)

  const navigation = useNavigation<AppNavigatorRoutesProps>()

  const route = useRoute()
  const { exerciseId } = route.params as RouteParamsProps

  const toast = useToast()

  function handleGoBack(){
    navigation.goBack()
  }

  async function fetchExerciseDetails(){
    try {
      setIsLoading(true)

      const response = await api.get(`/exercises/${exerciseId}`)
      setExercise(response.data)

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível carregar as informações do exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  async function handleExerciseHistoryRegister(){
    try {
      setSubmitingRegister(true)

      await api.post('/history', { exercise_id: exerciseId})

      toast.show({
        title:"Parabéns! Exercício registrado no seu histórico.",
        placement: 'top',
        bgColor: 'green.700'
      })

      navigation.navigate('history')

    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setSubmitingRegister(false)
    }
  }

  useEffect(() => {
    fetchExerciseDetails()
  }, [exerciseId])
  
  return (
    <VStack flex={1}>
      {isLoading ? (
          <Loading/>
        ) : (
          <>
            <VStack 
              px={4}
              bg="gray.600"
              pt={12}
            >
              <TouchableOpacity onPress={handleGoBack}>
                <Icon 
                  as={Feather}
                  name="arrow-left"
                  color="green.500"
                  size={6}
                />
              </TouchableOpacity>

              <HStack 
                justifyContent="space-between"
                mt={4}
                mb={6}
                alignItems="center"
              >
                <Heading 
                  color="gray.100" 
                  fontSize="lg"
                  flexShrink={1}
                  fontFamily="heading"
                >
                  {exercise.name}
                </Heading>

                <HStack alignItems="center">
                  <BodySvg/>

                  <Text 
                    color="gray.200"
                    ml={1}
                    textTransform="capitalize"
                  >
                    {exercise.group}
                  </Text>
                </HStack>
              </HStack>
            </VStack>

            <ScrollView>
              <VStack 
                pt={8} 
                px={4}
              >
                <Box rounded="md" mb={4} overflow="hidden">
                  <Image
                    w="full"
                    h={80}
                    source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                    alt="Nome do exercício"
                    resizeMode="cover"
                    rounded="lg"
                  />
                </Box>

                <Box 
                  bg="gray.600"
                  rounded="md"
                  pb={4}
                  px={4}
                  py={2}
                >
                  <HStack 
                    alignItems="center" 
                    justifyContent="space-around" 
                    mb={4} 
                    mt={2}
                  >
                    <HStack alignItems="center">
                      <SeriesSvg/>

                      <Text 
                        color="gray.200"
                        ml={2}
                        textTransform="capitalize"
                      >
                        {exercise.series} séries
                      </Text>
                    </HStack>

                    <HStack alignItems="center">
                      <RepetitionsSvg/>

                      <Text 
                        color="gray.200"
                        ml={2}
                        textTransform="capitalize"
                      >
                        {exercise.repetitions} repetições
                      </Text>
                    </HStack>
                  </HStack>

                  <Button
                    title="Marcar como realizado"
                    onPress={handleExerciseHistoryRegister}
                    isLoading={submitingRegister}
                  />
                </Box>
              </VStack>
            </ScrollView>
          </>
        )}
    </VStack>
  )
}