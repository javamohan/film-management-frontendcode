import http from "./http-common";
import AuthService from "./auth.service";
import { Component } from "react";

class UploadFilesService extends Component {



constructor(props) {
    super();
        this.state = {
      Authorization: ""
    };
  }


componentDidMount() {

  
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        Authorization:'Bearer ' + user.accessToken
      });
    }
 }

//




  upload(file, onUploadProgress) {
        let formData = new FormData();
        // 
    
  // my -changes
    formData.append("file", file);
    

    return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtaWxsZXIiLCJpYXQiOjE2MTA4MTU2NDMsImV4cCI6MTYxMDkwMjA0M30.3HA-hmbKs28aCwLpVMHTJcsPgDqZIPahV7YspLYolppmI3QoOx6S3F4t6TUSJx9rjgkiMK8e4kdFtOpJHuqVRw" 
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/filims", {
      headers:{
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtaWxsZXIiLCJpYXQiOjE2MTA4MTU2NDMsImV4cCI6MTYxMDkwMjA0M30.3HA-hmbKs28aCwLpVMHTJcsPgDqZIPahV7YspLYolppmI3QoOx6S3F4t6TUSJx9rjgkiMK8e4kdFtOpJHuqVRw"  
      }});
  }
}

export default new UploadFilesService();
