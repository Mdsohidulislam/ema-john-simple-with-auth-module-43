import React, { useEffect, useState } from 'react';
import fakeData from '../../fakeData';
import { getDatabaseCart, removeFromDatabaseCart } from '../../utilities/databaseManager';
import Cart from '../cart/Cart';
import ReviewItem from '../ReviewItem/ReviewItem';

const Review = () => {
    const [cart,setCart]=useState([]);
    useEffect(()=>{
        const saveCart=getDatabaseCart(); 
        // console.log(saveCart);
        const productKeys=Object.keys(saveCart);
        // console.log(productKeys);
        const cartProduct=productKeys.map(key=>{
            const product=fakeData.find(pd=>pd.key===key);
            product.quantity=saveCart[key]
            return product;
        });
        // console.log(cardProduct);
        setCart(cartProduct)
    },[])
    const removeProduct=(productKey)=>{ 
        const newCart=cart.filter(pd=>pd.key !== productKey);
        setCart(newCart)
        removeFromDatabaseCart(productKey);
    }
    let handle=true;
    return (
        <div className='shop-container'> 
            <div className="product-container">
                {
                    cart.map(pd=> <ReviewItem 
                        key={pd.key} 
                        product={pd}
                        removeProduct={removeProduct}
                        ></ReviewItem>)
                }
            </div>
            <div className="cart-container">  
                <Cart handle={handle} cart={cart}></Cart>
            </div>
        </div>
    );
};

export default Review;