import { useContext } from 'react'

import { AuthContext } from '../AuthContextProvider'

export const useAuth = () => {
  return useContext(AuthContext)
}
