import React from 'react';
import { SIGNINROUTE, REGISTERROUTE } from '../../routes';

const Navigation = ({onRouteChanged, isSignedIn}) => {
  if (isSignedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p onClick={() => onRouteChanged(SIGNINROUTE)} className='f3 link dim black underline pa3 pointer'>Sign Out</p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <p onClick={() => onRouteChanged(SIGNINROUTE)} className='f3 link dim black underline pa3 pointer'>Sign in</p>
        <p onClick={() => onRouteChanged(REGISTERROUTE)} className='f3 link dim black underline pa3 pointer'>Register</p>
      </nav>
    );
  }
}

export default Navigation;
