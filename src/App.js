// Router Module
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
// Adminitrations
import Dashboard from "./Components/Administration/Dashboard";
import AdminLogin from "./Components/Administration/AdminLogin";
// User Interface
import Home from "./Components/UserInterface/Home";
import ProductList from "./Components/UserInterface/ProductList";
import SetProductDetails from "./Components/UserInterface/SetProductDetails";
import MyCart from "./Components/UserInterface/MyCart";
import Address from "./Components/UserInterface/Address";
import PaymentGateway from "./Components/UserInterface/PaymentGateway";

function App(props) {
  return (
    <div>

      <Router>
        <Routes>
          
          <Route element={<Dashboard/>} path="/dashboard/*" />  {/* [*] Represent the Dashboard ke saare Routes */}
          <Route element={<AdminLogin/>} path="/adminlogin" />
          <Route element={<Home/>} path="/home" />
          <Route element={<ProductList/>} path="/productlist/:id/:icon" />
          <Route element={<SetProductDetails/>} path="/setproductdetails" />
          <Route element={<MyCart/>} path='/mycart'/>
          <Route element={<Address/>} path='/address'/>
          <Route element={<PaymentGateway/>} path='/paymentgateway'/>
        </Routes>
      </Router>
      
      </div>

  );
}

export default App;
