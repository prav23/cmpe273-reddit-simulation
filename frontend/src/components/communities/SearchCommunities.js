import React, { Component } from 'react';
import { connect } from 'react-redux';
import { resetSearchRedirect } from "../../actions/searchCommunitiesActions";
import './SearchCommunities.css';


class SearchCommunities extends Component {
  constructor(props) {
    super(props);
    
    this.state = {

    };
  }

  componentDidMount = () => {
    this.props.resetSearchRedirect();

    // TO-DO: GET CALL for communites & backend
  }

  render() {
    return (
      <div className="search">
        <div className="search__filters">
          <span className="search__sortbytext">Sort By</span>
        </div>

        <div className="search__communities">
          <div className="search__community">
            <div className="search__communityinfo">
              <span className="search__communityname">r/Marvel</span>
              <span className="search__communitymembers">1.0m Members</span>
            </div>
            
            <div className="search__communitydescription">
              <p className="search__communitytext">
                This is a subreddit dedicated to Marvel Comics, its publications and hundreds of characters. It is not affiliated with Marvel Entertainment, LLC and is an unofficial community operated by dedicated fans.
              </p>
            </div>

            <div className="search__joincommunity">
              <button type='button'>Join</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
    auth: state.auth,
  });

export default connect(mapStateToProps, { resetSearchRedirect })(SearchCommunities);