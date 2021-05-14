import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";
import Landing from "./layout/landing";
import Register from "./auth/register";
import Login from "./auth/login";
import Communities from "./communities/Communities";
import Community from "./communities/Community";
import CommunityUsers from "./communities/CommunityUsers";
import CommunityHome from "./communities/CommunityHome";
import CreatePost from "./posts/CreatePost";
import Dashboard from "./dashboard/dashboard";
import Posts from "./posts/posts";
import Comments from "./comments/comments";
import Message from "./message/Message";
import UserProfile from "./profile/UserProfile";
import Profile from "./profile/Profile";
import Invite from "./invites/Invite";
import SearchCommunities from "./communities/SearchCommunities";
import Analytics from "./analytics/Analytics";
import SendInvite from "./invites/SentInvite";
import AdminInvites from "./invites/AdminInvites";

//Create a Main Component
class Main extends Component {
  render() {
    return (
      <div>
        <div className="row">
          <Navbar />
        </div>
        <div className="row">
          <div className="col">
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/posts" component={Posts} />
              <Route path="/comments/:postId" component={Comments} />
              <Route path="/createpost/:communityName" component={CreatePost} />
              <Route path="/users/community" component={CommunityUsers} />
              <Route path="/communities" component={Communities} />
              <Route path="/community/:communityId" component={Community} />
              <Route path="/communityhome/:communityName" component={CommunityHome} />
              <Route exact path="/sendInvites" component={SendInvite} />
              <Route path="/sentInvites" component={AdminInvites} />
              <Route path="/message" component={Message} />
              <Route path="/userprofile" component={UserProfile} />
              <Route path="/profile" component={Profile} />
              <Route path="/invites" component={Invite} />
              <Route path="/findcommunities" component={SearchCommunities} />
              <Route path="/analytics" component={Analytics} />
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}
//Export The Main Component
export default Main;
