import React, {Component} from 'react';
import {Route} from 'react-router-dom';

import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";
import Landing from "./layout/landing";
import Register from "./auth/register";
import Login from "./auth/login";
import Communities from './communities/Communities';
import Community from './communities/Community';

import Dashboard from "./dashboard/dashboard";
import Message from "./message/messagePage";

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                <div className = "row">
                    <Navbar />
                </div>
                <div className = "row">
                    <div className = "col-2">
                        <Sidebar />
                    </div>
                    <div className = "col">
                        <Route exact path="/" component={Landing} />
                        <Route path="/register" component={Register} />
                        <Route path="/login" component={Login} />
                        <Route path="/dashboard" component={Dashboard} />
                        <Route path="/communities" component={Communities} />
                        <Route path="/community/:communityId">
                          <Community />
                        </Route>
                        <Route path="/message" component={Message} />

                    </div>
                </div>                
            </div>
        )
    }
}
//Export The Main Component
export default Main;