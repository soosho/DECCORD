import { create } from 'zustand'

interface AuthStore {
  otpModalOpen: boolean
  otpType: 'signup' | 'signin' | 'reset'
  otpEmail: string
  setOtpModal: (open: boolean) => void
  setOtpType: (type: 'signup' | 'signin' | 'reset') => void
  setOtpEmail: (email: string) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  otpModalOpen: false,
  otpType: 'signup',
  otpEmail: '',
  setOtpModal: (open) => set({ otpModalOpen: open }),
  setOtpType: (type) => set({ otpType: type }),
  setOtpEmail: (email) => set({ otpEmail: email }),
}))