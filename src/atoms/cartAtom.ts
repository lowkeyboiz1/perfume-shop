import type { ICartItem } from '@/types'
import { atom } from 'jotai'

export const cartAtom = atom<ICartItem[]>([])
