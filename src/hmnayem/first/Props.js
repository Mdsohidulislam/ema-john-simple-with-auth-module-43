import React from 'react';
import First from './First';
import {useEffect,useState} from 'react';

const Props=(props)=>{
    const [users,setUsers]=useState([]);
    useEffect(()=>{
        fetch('http://jsonplaceholder.typicode.com/users')
        .then(res=>res.json())
        .then(data=>setUsers(data))
    },[])
    console.log(users);
    return(
        <div>
            <h1>I am from Props components</h1>
        </div>
    )
}

export default Props;