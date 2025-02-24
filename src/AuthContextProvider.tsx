import Keycloak, { KeycloakConfig, KeycloakInitOptions, KeycloakTokenParsed } from 'keycloak-js'
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react'

import { SuspenseLoading } from './SuspenseLoading'

type AuthContextValues = {
  isAuthenticated: boolean
  logout: () => void
  hasRole: (role: string) => boolean
  keycloakError: boolean
  user?: KeycloakTokenParsed
  accountConsole: () => void
  keycloakInfo: {
    clientId?: string
    realm?: string
  }
  loginUpdateProfile: () => void
  loginUpdatePassword: () => void
  deleteProfile: () => void
  register: () => void
}
const keycloakURL = import.meta.env.VITE_APP_KEYCLOAK_URL
const keycloakRealm = String(import.meta.env.VITE_APP_KEYCLOAK_REALM)
const keycloakClientId = String(import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID)

const keycloakConfig: KeycloakConfig = {
  url: keycloakURL,
  realm: keycloakRealm,
  clientId: keycloakClientId,
}

const keycloakInitOptions: KeycloakInitOptions = {
  onLoad: 'login-required',
  flow: 'standard',
  checkLoginIframe: false,
}

export const keycloak = new Keycloak(keycloakConfig)

const defaultAuthContextValues: AuthContextValues = {
  isAuthenticated: false,
  keycloakError: false,
  logout: () => {},
  hasRole: () => false,
  accountConsole: () => {},
  keycloakInfo: {
    clientId: keycloak.clientId,
    realm: keycloak.realm,
  },
  loginUpdateProfile: () => {},
  loginUpdatePassword: () => {},
  deleteProfile: () => {},
  register: () => {},
}

export const AuthContext = createContext<AuthContextValues>(defaultAuthContextValues)

const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [keycloakError, setKeycloakError] = useState<boolean>(false)
  const [user, setUser] = useState<KeycloakTokenParsed | undefined>(undefined)
  const [keycloakInfo, setKeycloakInfo] = useState<{
    clientId?: string
    realm?: string
  }>({
    clientId: keycloak.clientId,
    realm: keycloak.realm,
  })

  const initializeKeycloak = useCallback(async () => {
    setKeycloakError(false)
    try {
      const isAuthenticatedResponse = await keycloak.init(keycloakInitOptions)
      if (!isAuthenticatedResponse) {
        keycloak.login()
      }
      setKeycloakInfo({
        clientId: keycloak.clientId,
        realm: keycloak.realm,
      })
      setIsAuthenticated(isAuthenticatedResponse)
      localStorage.setItem('your-token', JSON.stringify(keycloak.token))
      setUser(keycloak.idTokenParsed)
    } catch (error) {
      setIsAuthenticated(false)
      setKeycloakError(true)
      localStorage.removeItem('your-token')
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    initializeKeycloak()
  }, [initializeKeycloak])

  const logout = useCallback(async () => {
    try {
      await keycloak.logout()
      localStorage.removeItem('your-token')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('keycloak-logout error:', error)
    }
  }, [])

  keycloak.onTokenExpired = async () => {
    try {
      const isRefreshed = await keycloak.updateToken(5)
      if (isRefreshed) {
        localStorage.setItem('your-token', JSON.stringify(keycloak.token))
      }
    } catch (error) {
      keycloak.logout()
      throw error
    }
  }

  const hasRole = useCallback((role: string) => keycloak.hasRealmRole(role), [])
  const accountConsole = useCallback(() => keycloak.accountManagement(), [])
  const register = useCallback(() => keycloak.register(), [])
  const loginUpdatePassword = useCallback(
    () =>
      keycloak.login({
        action: 'UPDATE_PASSWORD',
      }),
    []
  )
  const loginUpdateProfile = useCallback(
    () =>
      keycloak.login({
        action: 'UPDATE_PROFILE',
      }),
    []
  )
  const deleteProfile = useCallback(
    () =>
      keycloak.login({
        action: 'delete_account',
      }),
    []
  )
  const contextValue = useMemo(() => {
    return {
      isAuthenticated,
      keycloakError,
      logout,
      hasRole,
      user,
      accountConsole,
      keycloakInfo,
      loginUpdatePassword,
      loginUpdateProfile,
      deleteProfile,
      register,
    }
  }, [
    isAuthenticated,
    keycloakError,
    logout,
    hasRole,
    user,
    accountConsole,
    keycloakInfo,
    loginUpdatePassword,
    loginUpdateProfile,
    deleteProfile,
    register,
  ])

  return (
    <React.StrictMode>
      <AuthContext.Provider value={contextValue}>
        {isAuthenticated || keycloakError ? children : <SuspenseLoading />}
      </AuthContext.Provider>
    </React.StrictMode>
  )
}

export default AuthContextProvider
