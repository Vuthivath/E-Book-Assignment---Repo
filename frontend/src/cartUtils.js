/**
 * Shared cart utility that syncs cart changes across all components
 * on the same page via a custom event.
 */

export function getCart() {
    try {
        return JSON.parse(localStorage.getItem('localCart') || '[]');
    } catch {
        return [];
    }
}

export function saveCart(cart) {
    localStorage.setItem('localCart', JSON.stringify(cart));
    // Dispatch custom event so other components on the same page react
    window.dispatchEvent(new CustomEvent('cartUpdated', {detail: cart}));
}

/**
 * Add an item to the cart. If it exists, increment quantity.
 * Returns the updated cart array.
 */
export function addToCart(book) {
    const cart = getCart();
    const exists = cart.find((item) => item.book_title === book.book_title);
    if (exists) {
        exists.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            ...book,
            quantity: 1,
        });
    }
    saveCart(cart);
    return cart;
}

/**
 * Hook to subscribe to cart changes. Returns the current cart.
 */
import {useState, useEffect} from 'react';

export function useCart() {
    const [cartItems, setCartItems] = useState(getCart);

    useEffect(() => {
        const loadCart = () => setCartItems(getCart());

        // Initial load
        loadCart();

        // Listen for custom event from same-tab saves
        window.addEventListener('cartUpdated', loadCart);
        // Listen for storage event from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'localCart') loadCart();
        });

        return () => {
            window.removeEventListener('cartUpdated', loadCart);
            window.removeEventListener('storage', loadCart);
        };
    }, []);

    return cartItems;
}
