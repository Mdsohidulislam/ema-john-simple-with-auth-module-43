import React from 'react';
import './ReviewItem.css'

const ReviewItem = (props) => { 
    const {name,quantity,key,price}=props.product;
 
    return (
        <div className='review-div'>
            <h4 className='product-name'>{name}</h4>
            <p>Quantity: {quantity}</p>
            <p>Price (single): ${price}</p>
            <br/>
            <button
            onClick={()=>props.removeProduct(key)}
            className='main-btn'
            >Remove</button>
        </div>
    );
};

export default ReviewItem;