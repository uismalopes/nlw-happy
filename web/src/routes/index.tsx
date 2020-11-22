import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConfirmDelete from '../pages/ConfirmDelete';
import CreateOrphanage from '../pages/CreateOrphanage';
import Dashboard from '../pages/Dashboard';
import EditOrphanage from '../pages/EditOrphanage';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Orphanage from '../pages/Orphanage';
import OrphanagesMap from '../pages/OrphanagesMap';
import PendingOrphanages from '../pages/PendingOrphanages';
import Success from '../pages/Success';
import PrivateRoute from './privateRoute';

function Routes(){
    return(
        <Switch>
            <Route path="/" component={Landing} exact />
            <Route path="/app" component={OrphanagesMap} />
            
            <Route path="/orphanages/create" component={CreateOrphanage} />
            <Route path="/orphanages/:id" component={Orphanage} />

            <Route path="/login" component={Login}/>
            <Route path="/success" component={Success}/>

            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/pendingOrphanages" component={PendingOrphanages} />
            <PrivateRoute path="/editOrphanage/:id" component={EditOrphanage} />
            <PrivateRoute path="/delete/:id" component={ConfirmDelete} />
        </Switch>
    );
}

export default Routes;