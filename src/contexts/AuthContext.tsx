import { createContext, ReactNode, useEffect, useState } from "react"

import { UserDTO } from "@dtos/UserDTO"

import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser"
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from "@storage/storageAuthToken"

import { api } from "@services/api"

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  isLoadingUserStorageData: boolean;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps)

export function AuthContextProvider({ children }: AuthContextProviderProps){
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setLoadingUserStorageData] = useState(true)

  async function signIn(email: string, password: string){
    try {
      const { data } = await api.post('/sessions', { email, password })

      if(data.user && data.token && data.refresh_token){
        setLoadingUserStorageData(true)

        await storageUserAndTokenSave(data.user, data.token, data.refresh_token)

        userAndTokenUpdate(data.user, data.token)
      }

    } catch (error) {
      throw error

    } finally {
      setLoadingUserStorageData(false)
    }
  }

  async function signOut() {
    try {
      setLoadingUserStorageData(true)

      setUser({} as UserDTO)

      await storageUserRemove()
      await storageAuthTokenRemove()
      
    } catch (error) {
      throw error

    } finally {
      setLoadingUserStorageData(false)
    }
  }

  async function updateUserProfile(userUpdated: UserDTO){
    try {
      setUser(userUpdated)

      await storageUserSave(userUpdated)

    } catch (error) {
      throw error
    }
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string){
    try {
      setLoadingUserStorageData(true)

      await storageUserSave(userData)
      await storageAuthTokenSave({ token, refresh_token })

    } catch (error) {
      throw error

    } finally {
      setLoadingUserStorageData(false)
    }
  }

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    
    setUser(userData)
  }

  async function loadUserData(){
    try {
      setLoadingUserStorageData(true)

      const userLogged = await storageUserGet()
      const { token } = await storageAuthTokenGet()

      if(userLogged && token){
        userAndTokenUpdate(userLogged, token)
      }
      
    } catch (error) {
      throw error

    } finally {
      setLoadingUserStorageData(false)
    }
  }

  useEffect(() => {
    loadUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut)

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        signIn, 
        isLoadingUserStorageData, 
        signOut,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}