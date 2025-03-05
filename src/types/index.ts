export interface IProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
}

export interface ICartItem extends IProduct {
  quantity: number
}

export interface IUser {
  id: string
  email: string
  name: string
}
