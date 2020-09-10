

const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { FormControl } = ReactBootstrap;
const { Form } = ReactBootstrap;

// ------------- show the book detail to set reading status FOR THE MODAL FORM ----------- //

function AddUploadBookDetailItem(props) {
    let history = useHistory(); 
    const reading_st = props.reading
    

    const [readingStatus, setReadingStatus] = React.useState();
    const [ownedStatus, setOwnedStatus] = React.useState();
    const[resetBookDetail, setResetBookDetail]= React.useState(false);
    const [confirmTitle, setConfirmTitle] =React.useState(props.title)
    const [confirmAuthor, setConfirmAuthor] =React.useState(props.author)

    console.log("IN ADDBOOKDETAILITEM MODAL", reading_st, props.shelfname,  props.owned, confirmTitle, confirmAuthor)

      const changeStatus = (event) => {
        setResetBookDetail(false)
        const statuses_update = 
          {"reading_status": readingStatus, "owned_status": ownedStatus, "shelf": props.shelfname, 
          "book_id": props.book_id, "author": confirmAuthor, "title": confirmTitle}
        console.log(statuses_update, "IS TIS WORKING UPLOAD FORM UPDATE")
        fetch('/update_status', {
          method: 'POST', 
          body: JSON.stringify(statuses_update),
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
         
            alert(`${data.shelved_book} added to Shelf ${props.shelfname}`);
            
          
        })
        console.log("UPDATING reading status", statuses_update)   
          event.preventDefault();
          
          console.log("sent to server??", statuses_update)
          setResetBookDetail(true)
          
        }
        history.push('/')

    return ( !resetBookDetail &&
         <React.Fragment>
                    <tr>
                    <td>
                    <form >
                    <label htmlFor="title" >Confirm Title</label>
                        <input type="text"  onChange={(e)=> setConfirmTitle(e.target.value)} placeholder={props.title}/>
                    </form>
                    </td>
                    <td>
                    <form >
                    <label htmlFor="author" >Confirm Author</label>
                        <input  type="text" onChange={(e)=> setConfirmAuthor(e.target.value)} placeholder={props.author}/>
                    </form>
                    </td>
                   
                    <td>{props.shelf}</td>
                    <td><label htmlFor="reading-menu" className="dropbtn">Reading Status</label>
                          <select name="reading-menu" onChange={e => setReadingStatus(e.target.value)} className="dropdown-content">
                                  {props.reading.map((status, index) =>
                                      <option key={index} value={status}>{status}</option>)}
                          </select></td>
                    <td><label htmlFor="book-menu" className="dropbtn">Book Status</label>
                          <select name="book-menu" onChange={e => setOwnedStatus(e.target.value)} className="dropdown-content">
                              {props.owned.map((name, index) =>
                                <option value={name} key={index}>{name}</option>)}
                          </select> </td>
                  {/*  <td><ReadingStatusMenu reading={reading_st} select_status ={true} handleReading={() => handleReading} /></td>
                    <td><BookStatusMenu owned={props.owned} select_status ={true} handleOwned={() => handleOwned} /></td> */}
                    <td><button className="btn btn-outline-info" onClick={changeStatus}>Add Book</button></td>
                    
                </tr>
            </React.Fragment> )
    }



// ---------------------UPLOAD A PHOTO AND GET BOOK INFORMATION -------
function UploadAPhoto(props){
    // upload a photo and scrape the text off of it
   let history = useHistory();
   const [shelfname, setShelfname] = React.useState("");
   const [booksFile, setBooksFile] = React.useState("");
   const [newBooks, setNewBooks] = React.useState();
   const [bookDetail, setBookDetail] = React.useState(['loading... count to 20... it takes a bit of time']);

   console.log("UPLOAD BOOK< SHELVES", props.shelves, props.reading, props.owned)

   function handleChange(newValue) {
    setShelfname(newValue);
    console.log("DID SHELF CHANGE", newValue, "SHELF TO BE PASSED", shelfname)
  }
   
   const uploadBookPhoto = (event) => {
   console.log('trying to add books to page')
 
     const post = {"filepath": booksFile, "shelfname": shelfname}
     console.log("POSTING DATA")
     fetch('/api/bookshelf/upload', {
       method: 'POST', 
       body: JSON.stringify(post),
       headers: {
         'Content-Type': 'application/json'
       }}
     )
     .then(response => response.json())
     .then(data => {
        const bookUpload =[];
        for (const post of data) {
            console.log("CHECKING SHELFNAME", shelfname)
            bookUpload.push(<AddUploadBookDetailItem  key = {post.book_id} book_id={post.book_id} 
                                                title={post.title} author={post.author}
                                                publisher={post.publisher} image = {post.img} 
                                                description={post.description} shelfname={shelfname} 
                                                reading={props.reading} owned={props.owned} /> )}

        
        console.log("PRINTING FROM FETCH PUSH", bookUpload)
        // setBookonShelf(true)
        setBookDetail(bookUpload);
        setNewBooks(true)
       })
       
   
       event.preventDefault();
       event.target.reset();
       history.push("/")
       console.log("NEW BOOKS logged?? ", newBooks)
     } 
     history.push("/")
  

     return (
            <React.Fragment>
            
                <div className="col">
                    <h4>Add a Book via Photo Upload</h4>
                        <form id="upload" className='form-upload' onSubmit={uploadBookPhoto}> 
                            <div className="dropdown">
                                <label htmlFor="shelf-menu" className="dropbtn">Please choose a Bookshelf: </label>
                                    <select name="shelf-menu" onChange={e => handleChange(e.target.value)} className="dropdown-content">
                                        {props.shelves.map((name, index) =>
                                        <option key={index} value={name} >{name}</option>)}
                                 </select>
                            </div>
                            {/* <ShelvesListMenu key={2} shelves={props.shelves} handleUploadShelf={() =>props.handleUploadShelf} /> */}
                            <div>
                                <label htmlFor="shelfname">Or add to a new shelf:  </label>
                                    <input type="text" name="shelfname" onChange={e => setShelfname(e.target.value)} /> <br />
                                <label htmlFor="fileElem">Select an image of a stack of books:</label>
                                    <input type="file" id="bookstack" className="btn btn-outline-info" name="booksFile" onChange={e => setBooksFile(e.target.value)} accept="image/png, image/jpeg" encType="multipart/form-data" /> <br />
                                
                            </div>
                        </form>
               

                    {/* Button trigger modal*/}
                    <button type="button" type='submit' form="upload" className="btn btn-info" data-toggle="modal" data-target="#uploadModal">
                    Confirm Books to add to shelf here
                    </button>

                    {/* Modal */}
                    <div className="modal fade upload-modal-lg" id="uploadModal" tabIndex="-1" role="dialog" aria-labelledby="myLargeUploadModal" aria-hidden="true">
                        <div className="modal-dialog" style={{maxWidth: "90%"}} role="form">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Books to upload</h5><br></br>
                                        
                                    
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    Please edit typos or delete books you do not want. 
                                    <table>
                                        <tbody>
                                        {bookDetail}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                   
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
                

            </React.Fragment>
           
       
         )

}
