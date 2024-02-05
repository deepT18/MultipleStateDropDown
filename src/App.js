import logo from './logo.svg';
import styles from './App.css';
import React , {useState,useEffect} from "react";
import axios from "axios";

function App() {
const [countries,setCountries]=useState([])
const [selectedCountry,setSelectedCountry]=useState('')
const [state,setState]=useState([])
const [selectedState,setSelectedState]=useState('')
const [city,setCity]=useState([])
const [selectedCity,setSelectedCity]=useState('')


useEffect(()=>{
  axios.get(`https://crio-location-selector.onrender.com/countries`).then((res)=>setCountries(res.data)).catch((err)=>console.error("Error fetching countries:",err))
},[])

useEffect(()=>{
 if(selectedCountry){
  console.log("Selected country:", selectedCountry)
  axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
  .then((res)=>{
    console.log(`Error---${res.data}`)
    setState(res.data);
    setSelectedState(""); // Reset state selection
    setCity([]); // Clear cities
    setSelectedCity("");
  })
  .catch((err)=>console.error("Error fetching states:",err))
}
},[selectedCountry])

useEffect(()=>{
  if(selectedCountry && selectedState){
    axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`).then((res)=>{
      setCity(res.data)
      setSelectedCity("");
    }).catch((err)=>{
      console.log("Error in fetching cities",err)
    })
  }
},[selectedCountry,selectedState])

  return (
    <div className={styles["city-selector"]}>
      <h1>Select Location</h1>
      <div className={styles.dropdowns}>
      <select className={styles.dropdown} value={selectedCountry} onChange={(e)=>{setSelectedCountry(e.target.value)}}>
        <option value="" disabled>Select Country</option>
        {countries.map((country)=>{
          return <option value={country} key={country.code}>{country}</option>
        })}
      </select>
      <select disabled={!selectedCountry} className={styles.dropdown} value={selectedState} onChange={(e)=>{setSelectedState(e.target.value)}}>
        <option value="" disabled>Select State</option>
        {state.map((state)=>{
          return <option value={state} key={state.code}>{state}</option>
        })}
      </select>

      <select disabled={!selectedState} className={styles.dropdown} value={selectedCity} onChange={(e)=>{setSelectedCity(e.target.value)}}>
        <option value="" selected>Select City</option>
        {city.map((city)=>{
          return <option value={city} key={city.code}>{city}</option>
        })}
      </select>
      </div>
      {selectedCity && (
        <h2 className={styles.result}>
          You selected <span className={styles.highlight}>{selectedCity}</span>,
          <span className={styles.fade}>
            {" "}
            {selectedState}, {selectedCountry}
          </span>
        </h2>
      )}
    </div>
  );
}

export default App;
