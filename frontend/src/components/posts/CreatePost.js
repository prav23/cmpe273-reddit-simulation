import { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { createPost } from '../../actions/postActions';

class CreatePost extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      communityName:'',
      author: '',
      title: '',
      votes: [],
      postType: '',
      url: '',
      text: '',
      image: '',
      errors: {},
      file: null,
      base64URL: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);  
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const postData = {
      communityName: this.props.match.params.communityName,
      author: this.props.auth.user.name,
      title: this.state.title,
      votes: this.state.votes,
      postType: this.state.postType,
      url: this.state.url,
      text: this.state.text,  
      image: this.state.base64URL
    };
    console.log(postData);
    this.props.createPost(postData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleFileInputChange = e => {
    console.log(e.target.files[0]);
    let { file } = this.state;
    this.setState({
      postType: 'image'
    });
    file = e.target.files[0];

    this.getBase64(file)
      .then(result => {
        file["base64"] = result;
        console.log("File Is", file);
        this.setState({
          base64URL: result,
          file
        });
      })
      .catch(err => {
        console.log(err);
      });

    this.setState({
      file: e.target.files[0]
    });
  };

  getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        console.log("Called", reader);
        baseURL = reader.result;
        console.log(baseURL);
        resolve(baseURL);
      };
      console.log(fileInfo);
    });
  };


  render() {
    const { isAuthenticated } = this.props.auth;
    const { errors } = this.state;

    return(
      <div className="row mt-4">
        <form onSubmit={this.onSubmit}>
          <ul class="nav nav-tabs" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="text-tab" data-toggle="tab" href="#text" role="tab" aria-controls="text" aria-selected="true">Text</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="image-tab" data-toggle="tab" href="#image" role="tab" aria-controls="image" aria-selected="false">Image</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="link-tab" data-toggle="tab" href="#link" role="tab" aria-controls="link" aria-selected="false">Link</a>
            </li>
          </ul>
          <div class="tab-content" id="myTabContent">
            <div class="tab-pane fade show active" id="text" role="tabpanel" aria-labelledby="text-tab">
              <div class="form-group">
                <input type="text" maxlength="50" class="form-control" id="exampleTitle" aria-describedby="titleHelp" placeholder="Post Title" value = {this.state.title} onChange = {(event) => this.setState({title: event.target.value})}/>
              </div>
              <div class="form-group">
                <input type="text" maxlength="250" class="form-control" id="exampleTextContent" placeholder="Text (required)" value = {this.state.text} onChange = {(event) => this.setState({text: event.target.value, postType: "text"})}/>
              </div>
            </div>
            <div class="tab-pane fade" id="image" role="tabpanel" aria-labelledby="image-tab">
              <div class="form-group">
                <input type="text" maxlength="50" class="form-control" id="exampleTitle" aria-describedby="titleHelp" placeholder="Post Title" value = {this.state.title} onChange = {(event) => this.setState({title: event.target.value})}/>
              </div>
              <div class="form-group">
                {/* <input type="text" class="form-control" id="exampleTextContent" placeholder="Image (upload)" /> */}
                <input class="form-control form-control-sm" id="formFile" type="file" onChange={this.handleFileInputChange} />
              </div>
            </div>
            <div class="tab-pane fade" id="link" role="tabpanel" aria-labelledby="link-tab">
              <div class="form-group">
                <input type="text" maxlength="50" class="form-control" id="exampleTitle" aria-describedby="titleHelp" placeholder="Post Title" value = {this.state.title} onChange = {(event) => this.setState({title: event.target.value})}/>
              </div>
              <div class="form-group">
                <input type="url" maxlength="250" class="form-control" id="exampleTextContent" placeholder="Url (required)" value = {this.state.url} onChange={(event) => this.setState({url: event.target.value, postType : "url"})}/>
              </div>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary">Create Post</button>
        </form>


      </div>
    );
  }
}

CreatePost.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps,{createPost})(withRouter(CreatePost));