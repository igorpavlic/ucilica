import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const store = useAuthStore()
  return {
    ...storeToRefs(store),
    loading: store.loading,
    error: store.error,
    login: store.login,
    register: store.register,
    logout: store.logout,
    enterAsGuest: store.enterAsGuest,
    initAuth: store.initAuth,
    addGuestScore: store.addGuestScore,
    updateUser: store.updateUser,
    refreshUser: store.refreshUser
  }
}
