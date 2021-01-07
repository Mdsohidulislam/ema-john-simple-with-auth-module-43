import { faTable } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const Cart = (props) => {
    const cart=props.cart;
    // const totalPrice=cart.reduce((total,prod)=>total+prod.price,0) 
    let total=0;
    for(let i=0; i<cart.length; i++){
        const product=cart[i];
        total=total+product.price*product.quantity; 
    };
    let shipping=0;
    if(total > 35){
        shipping=0;
    }else if(total > 15){
        shipping=4.99;
    }else if(total > 0){
        shipping =12.99;
    }
    const tax=(total/10).toFixed(2);
    const grandTotal=(total+shipping+Number(tax)).toFixed(2)
    const formatNumber=num=>{
        const precision=num.toFixed(2);
        return Number(precision)
    }


    return (
        <div>
            <h2>Order Summary</h2>
            <h5>Items ordered:{cart.length}</h5>
            <p>shipping Cost {formatNumber(shipping)}</p>
            <p>Tax + Vat : {tax}</p>
            <p>total price : {grandTotal}</p>
            <br/>
            <Link to='/review'>
            {props.handle ? <Link  to='/shipment' style={{textDecoration:'none'}} className='main-btn'>Procced Checkout</Link>: <button className='main-btn'>Review Order</button>}
            </Link>
        </div>
    )
};

export default Cart;