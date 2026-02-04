
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    brand?: string
    category?: string
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
    getTotalPrice: () => number
    getTotalItems: () => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem) => {
                const { items } = get()
                const existingItem = items.find((item) => item.id === newItem.id)

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.id === newItem.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                        isOpen: true // Open cart when adding
                    })
                } else {
                    set({
                        items: [...items, { ...newItem, quantity: 1 }],
                        isOpen: true // Open cart when adding
                    })
                }
            },

            removeItem: (id) => {
                set({
                    items: get().items.filter((item) => item.id !== id),
                })
            },

            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(id)
                } else {
                    set({
                        items: get().items.map((item) =>
                            item.id === id ? { ...item, quantity } : item
                        ),
                    })
                }
            },

            clearCart: () => set({ items: [] }),

            toggleCart: () => set({ isOpen: !get().isOpen }),

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            }
        }),
        {
            name: 'medical-farma-cart',
        }
    )
)
