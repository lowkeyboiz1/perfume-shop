'use client'

import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { userAtom } from '@/atoms/authAtom'
export function useAuth() {
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error)
      }
    }
  }, [setUser])

  const signIn = () => {
    const mockUser = {
      id: 'user_123',
      name: 'John Doe',
      email: 'john.doe@example.com',
      image: '/placeholder.svg?height=40&width=40',
      role: 'user',
      address: '123 Main St, City, Country',
      phone: '+1234567890',
      favoriteCategories: ['teddy-bears']
    }
    setUser(mockUser as any)
    localStorage.setItem('user', JSON.stringify(mockUser))
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return { user, signIn, signOut }
}
