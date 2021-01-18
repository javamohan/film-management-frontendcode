import React, { Component } from "react";
import UploadService from "../services/upload-files.service";
import ReactPaginate from 'react-paginate';
import DatePicker from 'react-datepicker';
import  "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.getAll = this.getAll.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
     this.handleChange = this.handleChange.bind(this);
     this.handleRatingChange = this.handleRatingChange.bind(this)
   
    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      fileInfos: [],

      offset: 0,
      tableData: [],
      orgtableData: [],
      perPage: 1,
      currentPage: 0,
      movieName:"",
      description:"",
      realeaseDate: new Date(),
      rating:1,
      ticketPrice:0,
      country:"",
      genre:""

    };
  }

// Release Date Picker
handleChange(date) {
    this.setState({
      realeaseDate: date
    })
  }
  // Rating Select
 handleRatingChange(event){
    this.setState({
      rating:event.target.value
      });
  }

// Pagination
  handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });

    };
//form data submition
      handleSubmit(event) {
      event.preventDefault();
      alert(event.target.TicketPrice.value)
      this.setState({
						movieName:event.target.Name.value,
            description:event.target.Description.value,
            realeaseDate:this.state.realeaseDate,
           rating:this.state.rating,
            ticketPrice:event.target.TicketPrice.value,
            country:event.target.Country.value,
            genre:event.target.Genre.value,
		})
   }

  loadMoreData() {
		const data = this.state.orgtableData;
		
		const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
		this.setState({
			pageCount: Math.ceil(data.length / this.state.perPage),
			tableData:slice
		})
	
    }


  componentDidMount() {
    // no -op
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  upload() {
    let currentFile = this.state.selectedFiles[0];
    let movieName = this.state.movieName;
    let description = this.state.description;
    let realeaseDate = this.state.realeaseDate;
    let rating = this.state.rating;
    let ticketPrice = this.state.ticketPrice;
    let country = this.state.country;
    let genre = this.state.genre;
    this.setState({
      progress: 0,
      currentFile: currentFile,
      //movieName = movieName,
    });

    UploadService.upload(currentFile, 
    this.state.movieName , 
    this.state.description,
    this.state.realeaseDate,
    this.state.rating,
    this.state.ticketPrice,
    this.state.country,
    this.state.genre,
    (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
    
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          //message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }


  getAll(){
UploadService.getFiles().then((response) => {
 console.log(response);
var data = response.data;
var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)


 this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    orgtableData :response.data,
                    tableData:slice

                })
       });
  }



  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      fileInfos,
    } = this.state;

    return (
      <div>
      <form onSubmit={this.handleSubmit}>
        <label htmlFor="Name">Name</label>
        <input id="Name" name="Name" type="text" />

        <label htmlFor="Description">Description</label>
        <input id="Description" name="Description" type="text" />

          <label htmlFor="RealeaseDate">RealeaseDate</label>
         <DatePicker
              selected={ this.state.realeaseDate }
              onChange={ this.handleChange }
              name="realeaseDate"
              dateFormat="dd/MM/yyyy" 
          />
        <label htmlFor="Rating">Rating</label>
        <select id="dropdown" onChange={this.handleRatingChange} >
       <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

        <label htmlFor="TicketPrice">TicketPrice</label>
        <input type="number"  id="TicketPrice" name="TicketPrice" pattern="[0-9]*" inputmode="numeric"></input>
        <label htmlFor="Country">Country</label>
        <input id="Country" name="Country" type="text" />

        <label htmlFor="Genre">Genre</label>
        <input id="Genre" name="Genre" type="text" />

        <button>Send data!</button>
      
        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className="btn btn-default">
          <input type="file" onChange={this.selectFile} />
        </label>

        <button
          className="btn btn-success"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>
</form>
&nbsp; &nbsp; &nbsp;
        <button
          className="btn btn-success"
           onClick={this.getAll}
        > 
          ShowAll
        </button>


        <div className="alert alert-light" role="alert">
          {message}
        </div>


        <div>
        
                         <table border="1">
                     <thead>
                         <th>Name</th>
                         <th>Description</th>
                         <th>Photo</th>
                         <th>Realease Date</th>
                         <th>Rating</th>
                         <th>Ticket Price</th>
                         <th>Country</th>
                          <th>Genre</th>

                     </thead>
                     <tbody>
                        {
                          this.state.tableData.map((tdata, i) => (
                                <tr>
                                    <td>{tdata.name}</td>
                                    <td>{tdata.description}</td>
                                    <td>  <img src={`data:image/jpeg;base64,${tdata.photo.data}`} /></td>
                                    <td>{tdata.realeaseDate}</td>
                                    <td>{tdata.rating}</td>
                                    <td>{tdata.ticketPrice}</td>
                                    <td>{tdata.country}</td>
                                    <td>{tdata.genre}</td>
                                 </tr>
                            
                          ))
                        }

                     </tbody>
                 </table>  

                 <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>

            </div>
      </div>
    );
  }
}
