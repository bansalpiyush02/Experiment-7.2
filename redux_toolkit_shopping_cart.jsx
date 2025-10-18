// Implement Redux Toolkit for State Management in a Shopping Cart
// React + Redux Toolkit example demonstrating add/remove/update functionality

import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// ---------------- Redux Slice ----------------
const cartSlice = createSlice({
  name: 'cart',
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      return state.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.find(i => i.id === id);
      if (item) item.quantity = quantity > 0 ? quantity : 1;
    }
  }
});

const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
const store = configureStore({ reducer: { cart: cartSlice.reducer } });

// ---------------- Product List Component ----------------
const ProductList = () => {
  const dispatch = useDispatch();
  const products = [
    { id: 1, name: 'Laptop', price: 800 },
    { id: 2, name: 'Keyboard', price: 60 },
    { id: 3, name: 'Mouse', price: 40 },
    { id: 4, name: 'Headphones', price: 120 }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {products.map(product => (
        <Card key={product.id} className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">${product.price}</p>
            <Button
              className="mt-2 w-full"
              onClick={() => dispatch(addToCart(product))}
            >
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// ---------------- Cart Component ----------------
const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map(item => (
            <Card key={item.id} className="shadow-sm">
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>${item.price} × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}>-</Button>
                  <span>{item.quantity}</span>
                  <Button size="sm" onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}>+</Button>
                  <Button variant="destructive" size="sm" onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="text-right font-semibold text-lg">Total: ${total.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
};

// ---------------- App Root ----------------
const App = () => (
  <Provider store={store}>
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-center p-4">Redux Toolkit Shopping Cart</h1>
      <ProductList />
      <Cart />
    </div>
  </Provider>
);

export default App;

/* ----------------------------------------------------------------------
Setup Instructions:
1. Create React app:
   npx create-react-app redux-cart
   cd redux-cart
   npm install @reduxjs/toolkit react-redux

2. Replace App.js content with the code above.
   (Ensure Tailwind or your preferred styling is configured.)

3. Run app:
   npm start

4. Test interactions:
   - Add multiple items
   - Increase/decrease quantities
   - Remove items
   Observe real-time updates in cart using Redux Toolkit global state.
---------------------------------------------------------------------- */