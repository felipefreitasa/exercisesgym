import { useState } from "react"

import { Center, Image, Text, VStack, Heading, ScrollView, useToast } from "native-base"

import { useNavigation } from "@react-navigation/native"

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'

import { useAuth } from "@hooks/useAuth"

import { AppError } from "@utils/AppError"

import * as yup from "yup"
import { Controller, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Input } from "@components/Input"
import { Button } from "@components/Button"

type FormDataProps = {
  email: string;
  password: string;
}

const signInSchema = yup.object({
  email: yup.string().required("Informe o e-mail."),
  password: yup.string().required("Informe a senha.")
})

export function SingIn() {
  const [isLoading, setIsLoading] = useState(false)

  const { signIn } = useAuth()

  const toast = useToast()

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signInSchema)
  })

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  function handleNewAccount(){
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormDataProps){
    setIsLoading(true)

    try {
      await signIn(email, password)
      
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mais tarde.'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <VStack 
        flex={1} 
        px={10}
        pb={16}
      >
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text 
            color="gray.100" 
            fontSize="sm"
          >
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading 
            color="gray.100" 
            fontSize="xl" 
            mb={6} 
            fontFamily="heading"
          >
            Acesse sua conta
          </Heading>

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

          <Button 
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text 
            color="gray.100" 
            fontSize="sm" 
            fontFamily="body"
            mb={3}
          >
            Ainda não tem acesso ?
          </Text>

          <Button 
            title="Criar conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}