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




  upload(file, 
name,
description,
realeaseDate,
rating,
ticketPrice,
country,
genre,
onUploadProgress) {
let formData = new FormData();
     formData.append("file", file); 
     formData.append("name",name);
    formData.append("description",description);
    formData.append("realeaseDate",realeaseDate);
    formData.append("rating",rating);
    formData.append("ticketPrice",ticketPrice);
    formData.append("country",country);
     formData.append("genre",genre);
    
     return http.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtaWxsZXIiLCJpYXQiOjE2MTA5MzY0NzcsImV4cCI6MTYxMTAyMjg3N30.8uPTmDsbESuw850Rdi4mhz3rD3svdNnngFsqJkFSBVkklKIHhUAoe9gpAx0zv8mPmDQHOPJJKDHVCXlIqWhrrQ" 
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return http.get("/filims", {
      headers:{
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtaWxsZXIiLCJpYXQiOjE2MTA5MzY0NzcsImV4cCI6MTYxMTAyMjg3N30.8uPTmDsbESuw850Rdi4mhz3rD3svdNnngFsqJkFSBVkklKIHhUAoe9gpAx0zv8mPmDQHOPJJKDHVCXlIqWhrrQ"  
      }});
  }
}

export default new UploadFilesService();
