import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

import { useAuth } from '../context/auth';

interface Props extends RouteProps{
    component: React.FC<RouteProps>;
}

export default function PrivateRoute({ component: Component, ...rest}: Props){
    const { signed } = useAuth();
    
    return(
        <Route {...rest}
        render={ props => 
            (
                signed ? ( 
                    <Component {...props} /> 
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location }}} />
                ) 
            )
        }
        />
    );
}