'use client'

import { atom } from 'jotai'

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: 'user' | 'admin'
  address?: string
  phone?: string
  favoriteCategories?: string[]
}

// Atom lưu trạng thái người dùng
export const userAtom = atom<User | null>(null)
