import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css';
// import brain from './brain.jpg';
import zerone from './01.png';

const Logo = ()=>{
	return (
		<div className='ma4 mt0'>
		  <Tilt className="Tilt shadow-2 br2" options={{ max : 40 }} style={{ height: 200, width:200}} >
 			<div className="Tilt-inner pa3"> 
 			  <img style={{paddingTop:'5px'}} src = {zerone} alt='Logo'/>
 		    </div>
		  </Tilt>
		</div>
	)

}

export default Logo;