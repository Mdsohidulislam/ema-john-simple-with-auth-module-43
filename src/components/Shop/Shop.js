import React, { useEffect } from 'react';
import fakeData from '../../fakeData'; 
import {useState} from 'react'
import './Shop.css';
import Product from '../product/Product'
import Cart from '../cart/Cart'
import  {addToDatabaseCart, getDatabaseCart} from '../../utilities/databaseManager';

const Shop = () => { 
    const first10=fakeData.slice(0,10) 
    const [data, setData] = useState(first10); 
    const [cart,setCart]=useState([])
    useEffect(()=>{
        const savedCart=getDatabaseCart();
        const productKey=Object.keys(savedCart) 
        const previousCart=productKey.map(existingKey=>{
            const product =fakeData.find(pd=>pd.key===existingKey);
            // console.log(existingKey,savedCart[existingKey]);
            product.quantity=savedCart[existingKey];
            return product;
        }) 
        setCart(previousCart)
    },[])
//  38.5 complete



    const handleAddProduct=(product)=>{ 
        // const cart=product.onClick;
        const toBeAddedKey=product.key;
        const sameProduct=cart.find( pd => pd.key===toBeAddedKey);
        let count=1;
        let newCart;
        if(sameProduct){
            count=sameProduct.quantity +1;
            sameProduct.quantity=count;
            const others =cart.filter(pd => pd.key !== toBeAddedKey)
            newCart=[...others,sameProduct]
        }else{
            product.quantity=1;
            newCart=[...cart,product];
        } 
        setCart(newCart); 
        addToDatabaseCart(product.key, count) 

        newCart=[...cart,product]; 
        setCart(newCart); 
        const sameeProduct=newCart.filter( pd => pd.key===product.key);
        let count1=sameeProduct.length; 
        addToDatabaseCart(product.key, count1)    
    }



    return (
        <div className="shop-container">
            <div className="product-container">
                {
                    data.map(pro=><Product key={pro.key} showAddToCart={true} handleAddProduct={handleAddProduct} pro={pro}></Product>)
                }
            </div>
            <div className="cart-container"> 
                <Cart cart={cart}></Cart>; 
            </div>
        </div>
    );
};

export default Shop;