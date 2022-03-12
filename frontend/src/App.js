import  React,{useEffect, useState} from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import {Room, Star, MapOutlined,VpnKey, RateReview, House, Grade, NoteAdd, Help, LocationCity} from '@material-ui/icons';

import "./App.css";


import axios from 'axios';
import {format} from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';
import ReactMapGL, { FlyToInterpolator, NavigationControl } from 'react-map-gl';    import 'mapbox-gl/dist/mapbox-gl.css';


    // added the following 6 lines.
    import mapboxgl from 'mapbox-gl';

    // The following is required to stop "npm build" from transpiling mapbox code.
    // notice the exclamation point in the import.
    //@ts-ignore
  // eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
    mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;
function App() {
  const myStorage=window.localStorage;
  const [currentUser, setCurrentUser]= useState(myStorage.getItem("user"));
  const [pins,setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [rating,setRating] = useState(0);
  const [showRegister,setShowRegister] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [viewport, setViewport]=useState({
   
    latitude:46,
    longitude:17,
    zoom:4
  });
 useEffect(() => {
const getPins= async () =>{

  try{
const res= await axios.get("/pins");
setPins(res.data);
  }
  catch(err){
console.log(err);
  }
};
getPins();

 }, []);

 const handleMarkerClick = (id,lat,long) =>{
setCurrentPlaceId(id);
setViewport({ ...viewport, latitude:lat, longitude:long});
 };

 const handleAddClick = (e) => {
//console.log(e);
const {lat, lng:long} = e.lngLat;
  
setNewPlace({
  lat,long
});

 };
const handleSubmit = async (e) =>{
  e.preventDefault();
  const newPin ={
    username:currentUser,
    title,
    desc,
    rating,
    lat:newPlace.lat,
    long:newPlace.long,
  }
  try{
const res= await axios.post("/pins", newPin);
setPins([...pins,res.data]);
setNewPlace(null);
  }catch(err){
    console.log(err);
  }
}
const handleLogout =() =>{
  myStorage.removeItem("user");
  setCurrentUser(null);
}
  return ( <div className='App'>
   <Map
   
      initialViewState={{
        longitude: 17,
        latitude: 46,
        zoom: 4
      }}
      style={{width: "100vw", height: "100vh"}}
     
      mapStyle="mapbox://styles/nivedita-021/ckzr2k8ub002l15jvgism35tg"
      mapboxAccessToken='pk.eyJ1Ijoibml2ZWRpdGEtMDIxIiwiYSI6ImNrenByMTJucDBvaGUyd3BlNGpheG9pM24ifQ.OV4bkOJt702q3mpabvJtFQ'
     
      onDblClick={handleAddClick}
      >
        {pins.map((p) =>(
          <>
      <Marker  latitude={p.lat} longitude={p.long} anchor="bottom">
      <Room style={{fontSize:7 * viewport.zoom, color:currentUser===p.username?"red":"slateblue", cursor:"pointer"}} 
      onClick={() =>handleMarkerClick(p._id,p.lat,p.long)}
      
      />
    </Marker>
    {p._id === currentPlaceId && 
    <Popup longitude={p.long} latitude={p.lat}
        anchor="right"
        closeButton={true}
        closeOnClick={false}
        onClose={() => setCurrentPlaceId(null) }
> 
<div className='rev'><RateReview/>Review</div>
       <div className='card'>
       
<label><House/>&nbsp;Place</label>
<h4 className='place'>{p.title}</h4>
<label><NoteAdd/>&nbsp;Review</label>
<p className='desc'>{p.desc}</p>
<label><Grade/>&nbsp;Rating</label>
<div className='stars'>
 {Array(p.rating).fill(<Star className='star' />)}
 
</div>
<label><Help/>&nbsp;Information :</label>
<span className='username'> Created by <b>{p.username}</b></span>
<span className='date'>{format(p.createdAt)}</span>

       </div>
      </Popup>
       }
      </>
      ))}
   
    {newPlace && (
    <Popup longitude={newPlace.long} latitude={newPlace.lat}
        anchor="right"
        closeButton={true}
        closeOnClick={false}
        onClose={() => setNewPlace(null) }
>
  <div>
    <div className='divs'><LocationCity />Add Review<br /><br /></div>
    <form onSubmit={handleSubmit}>
      <label><House/>&nbsp;Title</label>
      <input placeholder='Enter a Title' onChange={(e) => setTitle(e.target.value)}/>
      <label><NoteAdd/>&nbsp;Review</label>
      <textarea placeholder='Say something about this place...' 
      onChange={(e) => setDesc(e.target.value)}
      />
      <label><Grade/>&nbsp;Rating</label>
      <select onChange={(e) => setRating(e.target.value)}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>
      <button className='submitButton' type="submit">Add Pin</button>
    </form>
    </div>
</Popup>
    )}
    {currentUser ? (<button className='button logout' onClick={handleLogout}>Log Out</button>) : ( <div className='buttons'>

   
<button className='button login' onClick={() => setShowLogin(true)}><div className='log'><MapOutlined />&nbsp;&nbsp;Login</div></button>
<button className='button register' onClick={() => setShowRegister(true)}><div className='log'><VpnKey/>&nbsp;&nbsp;Register</div></button>
</div>)}

{showRegister && <Register setShowRegister={setShowRegister} />}
{showLogin && (<Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>)}
    
   
     </Map>
    </div>
  );

}

export default App;
