import { create } from 'zustand';

const useCartStore = create((set, get) => ({
    cart: [],

    addToCart: (product) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.idProducto === product.idProducto);

        if (existingItem) {
            set({
                cart: cart.map(item =>
                    item.idProducto === product.idProducto
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ),
            });
        } else {
            set({ cart: [...cart, { ...product, quantity: 1 }] });
        }
    },

    removeFromCart: (productId) => {
        set({ cart: get().cart.filter(item => item.idProducto !== productId) });
    },

    updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
            get().removeFromCart(productId);
            return;
        }
        set({
            cart: get().cart.map(item =>
                item.idProducto === productId ? { ...item, quantity } : item
            ),
        });
    },

    clearCart: () => set({ cart: [] }),

    getTotal: () => {
        return get().cart.reduce((total, item) => total + (item.precioVenta * item.quantity), 0);
    },
}));

export default useCartStore;
