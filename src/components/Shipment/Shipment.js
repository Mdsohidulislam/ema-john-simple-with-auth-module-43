import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../App";
import './Shipment.css'

export default function App() {
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = data => console.log(data);
    const [loggedInUser,setLoggedInUser]=useContext(UserContext)

  return (
    <form className="ship-form" onSubmit={handleSubmit(onSubmit)}>   

      <input placeholder="Enter your name here...."  defaultValue={loggedInUser.name} name="name" ref={register({ required: true })} />
      {errors.name && <span className="error">Name is required</span>}

      <input placeholder="Enter your Email here...." name="email" defaultValue={loggedInUser.email} ref={register({ required: true })} />
      {errors.email && <span className="error">Email is required</span>}

      <input placeholder="Enter your Phone number here...." name="phone" ref={register({ required: true })} />
      {errors.phone && <span className="error">Phone is required</span>}

      <input placeholder="Enter your address here...." name="address" ref={register({ required: true })} />
      {errors.address && <span className="error">Address is required</span>}

      <input placeholder="Enter your zipCode here...." name="zipCode" ref={register({ required: true })} />
      {errors.zipCode && <span className="error">ZipCode is required</span>}
      
      <input type="submit" />
    </form>
  );
}