import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const MAX_CART_QUANTITY = 99;

function normalizeItems(value: unknown): CartItem[] {
  if (!Array.isArray(value)) return [];

  const normalized = new Map<number, number>();

  for (const item of value) {
    if (!item || typeof item !== 'object') continue;

    const id = (item as { id?: unknown }).id;
    const quantity = (item as { quantity?: unknown }).quantity;

    if (
      typeof id !== 'number' ||
      !Number.isSafeInteger(id) ||
      typeof quantity !== 'number' ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      continue;
    }

    normalized.set(id, Math.min(MAX_CART_QUANTITY, (normalized.get(id) ?? 0) + quantity));
  }

  return Array.from(normalized, ([id, quantity]) => ({ id, quantity }));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,

      addToCart: (id) => set((state) => {
        const existingItem = state.items.find(item => item.id === id);
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === id
                ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, item.quantity + 1) }
                : item
            ),
            isCartOpen: true, // Open cart automatically when adding
          };
        }
        return {
          items: [...state.items, { id, quantity: 1 }],
          isCartOpen: true,
        };
      }),

      removeFromCart: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => {
        const normalizedQuantity = Number.isFinite(quantity) ? Math.trunc(quantity) : 1;
        if (normalizedQuantity <= 0) {
          return { items: state.items.filter(item => item.id !== id) };
        }

        return {
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: Math.min(MAX_CART_QUANTITY, normalizedQuantity) }
              : item
          ),
        };
      }),

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
    }),
    {
      name: 'dais-cart',
      version: 2,
      partialize: (state) => ({ items: state.items.map(({ id, quantity }) => ({ id, quantity })) }),
      migrate: (persistedState) => {
        const state = persistedState as { items?: unknown };
        return { items: normalizeItems(state?.items), isCartOpen: false };
      },
      merge: (persistedState, currentState) => {
        const state = persistedState as { items?: unknown };
        return {
          ...currentState,
          items: normalizeItems(state?.items),
        };
      },
    }
  )
);
