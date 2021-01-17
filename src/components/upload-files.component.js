import React, { Component } from "react";
import UploadService from "../services/upload-files.service";
import ReactPaginate from 'react-paginate';

export default class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.getAll = this.getAll.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
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
      currentPage: 0
    };
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

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    UploadService.upload(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        //return UploadService.getFiles();
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
    //  this.setState({
      //  fileInfos: response.data,
     // });


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
