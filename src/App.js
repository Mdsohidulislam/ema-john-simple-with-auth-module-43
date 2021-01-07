import Header from './components/Header/Header';
import Shop from './components/Shop/Shop';
import {Route,Switch,Link} from 'react-router-dom';
import NotFound from './components/NotFound/NotFound';
import Inventory from './components/Inventory/Inventory'
import Review from './components/Review/Review';
import PorductDetail from './components/ProductDetail/PorductDetail';
import Login from './components/Login/Login';
import Shipment from './components/Shipment/Shipment'
import { createContext, useState } from 'react';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';

export const UserContext=createContext()

const App=()=>{

  const [loggedInUser,setLoggedInUser]=useState({})

  return (
    <UserContext.Provider value={[loggedInUser,setLoggedInUser]}>   
    <Header></Header>
      <Switch>
          <Route path='/shop'>
            <Shop></Shop>
          </Route>
          <Route path='/review'> 
            <Review></Review>
          </Route>
          <PrivateRoute path='/inventory'> 
            <Inventory></Inventory>
          </PrivateRoute>
          <Route path='/login'> 
            <Login></Login>
          </Route>
          <PrivateRoute path='/shipment'> 
            <Shipment></Shipment>
          </PrivateRoute>
          <Route exact path='/'>
            <Shop></Shop>
          </Route>
          <Route path='/product/:productKey'>
              <PorductDetail></PorductDetail>
          </Route>
          {/* path='*' sob niche dite hobe na hole kaj korbe na */}
          <Route path='*'>
              <NotFound></NotFound>
          </Route>
      </Switch>

      {/* <h1>Hi, I am md sohidul islam. I am from Bangladesh</h1> */}
    </UserContext.Provider>
  )
}


export default App;


