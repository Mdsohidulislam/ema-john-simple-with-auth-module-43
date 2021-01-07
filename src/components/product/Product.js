import React from 'react';
import './Product.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee,faShoppingCart} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Product = (props) => {  
    const {img,name,seller,price,stock,key}=props.pro;
    return ( 
        <div className='product'>  
            <div className="img">
                <img src={img}/>
            </div>
            <div className="info">
                <h4 className='info-name'><Link to={`/product/${key}`}>{name}</Link></h4> 
                <p>by: {seller}</p>
                <p>Price: ${price}</p>
                <p>only {stock} left in stock - order soon</p>
                {/* add condition */}
                {/* {props.showAddToCart === &&  */}
                {props.showAddToCart &&  <button className='main-btn' onClick={()=>props.handleAddProduct(props.pro)}><FontAwesomeIcon icon={faShoppingCart} />add to cart</button>}
            </div>
        </div>
    );
};

export default Product;