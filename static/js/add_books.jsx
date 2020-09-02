const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;


function BookDetailItem(props) {
        
    return <React.Fragment>

            <table>
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                    </tr>
                </thead>
                <tbody>
        
                    <tr>
                        <td> <img src={props.image}></img></td>
                        <td>{props.title}</td>
                        <td>{props.author}</td>
                        <td>{props.publisher}</td>
                    </tr>
                    <tr><td>{props.description}</td></tr>
                    <tr>
                        <td><button>Edit Book</button></td>
                        <td><Link to={`/bookshelf`}>Go to BookShelf</Link></td>
                    </tr>
                </tbody>
            </table>
            </React.Fragment>
}


function ShowBookInfo(props) {
    const [bookInfo, setBookInfo] = React.useState();
    console.log("at showbookinfo")
    let { bookId } = useParams();

    
    React.useEffect(() => {
      console.log("fetching book detail info...")
      fetch(`/api/book_info/${bookId}`)
      .then(response => response.json())
      .then((data) => {
        const bookstuff = <BookDetailItem key = {data.book_id} book_id={data.book_id} 
                                        title={data.title} author={data.author}
                                        publisher={data.publisher} image = {data.img} 
                                        description={data.description}/>
      
         setBookInfo(bookstuff);
      })
    }, []);
    
    return <div> 
              <h2> Book Info</h2>
              
                    {bookInfo}
              
            </div>
  }

//   function ConfirmUploadTextsModal(props){


//     return(<div className="modal" tabindex="-1" role="dialog">
//     <div className="modal-dialog" role="document">
//       <div className="modal-content">
//         <div className="modal-header">
//           <h5 className="modal-title">Modal title</h5>
//           <button type="button" className="close" data-dismiss="modal" aria-label="Close">
//             <span aria-hidden="true">&times;</span>
//           </button>
//         </div>
//         <div className="modal-body">
//           <p>Modal body text goes here.</p>
//         </div>
//         <div className="modal-footer">
//           <button type="button" className="btn btn-primary">Save changes</button>
//           <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
//         </div>
//       </div>
//     </div>
//   </div>

//     )
//   }


// ---------------------UPLOAD A PHOTO AND GET BOOK INFORMATION -------
function UploadAPhoto(props){
    // upload a photo and scrape the text off of it
   let history = useHistory();
   const [shelfname, setShelfname] = React.useState("");
   const [booksFile, setBooksFile] = React.useState("");
   const [newBooks, setNewBooks] = React.useState();
   const [bookDetail, setBookDetail] = React.useState([]);

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
    
        for (const post of data) {
            console.log("CHECKING SHELFNAME", shelfname)
            bookDetail.push(<AddBookDetailItem  key = {post.book_id} book_id={post.book_id} 
                                                title={post.title} author={post.author}
                                                publisher={post.publisher} image = {post.img} 
                                                description={post.description} shelfname={shelfname} 
                                                reading={props.reading} owned={props.owned} /> )}

        
        console.log("PRINTING FROM FETCH PUSH", bookDetail)
        // setBookonShelf(true)
        setBookDetail(bookDetail);
        setNewBooks(true)
       })
       
   
       event.preventDefault();
       event.target.reset();
       
       console.log("NEW BOOKS logged?? ", newBooks)
     } 
     history.push('/')

     return (
            <React.Fragment>
            
                <div className="col">
                    <h4>Add a Book via Photo Upload</h4>
                        <form className='form-upload' onSubmit={uploadBookPhoto}> 
                            <div className="dropdown">
                                <label htmlFor="shelf-menu" className="dropbtn">Please choose a Bookshelf</label>
                                    <select name="shelf-menu" onChange={e => handleChange(e.target.value)} className="dropdown-content">
                                        {props.shelves.map((name, index) =>
                                        <option key={index} value={name} >{name}</option>)}
                                 </select>
                            </div>
                            {/* <ShelvesListMenu key={2} shelves={props.shelves} handleUploadShelf={() =>props.handleUploadShelf} /> */}
                            <div>
                                <label htmlFor="shelfname">Or add to a new shelf: </label>
                                    <input type="text" name="shelfname" onChange={e => setShelfname(e.target.value)} /> <br />
                                <label htmlFor="fileElem">Select an image of a stack of books</label>
                                    <input type="file" id="bookstack" name="booksFile" onChange={e => setBooksFile(e.target.value)} accept="image/png, image/jpeg" encType="multipart/form-data" /> <br />
                                <button type="submit"> Click here to upload</button>
                            </div>
                        </form>
               

                    {/* Button trigger modal*/}
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#uploadModal">
                    Confirm Books to add to shelf here
                    </button>

                    {/* Modal */}
                    <div className="modal fade upload-modal-lg" id="uploadModal" tabIndex="-1" role="dialog" aria-labelledby="myLargeUploadModal" aria-hidden="true">
                        <div className="modal-dialog modal-lg" role="form">
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
                                    <button type="button" className="btn btn-primary">Save changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
                

            </React.Fragment>
           
       
         )

}


// ------------------------- ADD A BOOK TO SHELF ----------

function AddaBook(props) {
    let history = useHistory();
    const [bookDetail, setBookDetail] = React.useState([]);
        // const [newBooks, setNewBooks] = React.useState();
    const [shelfname, setShelfname] = React.useState("");
    const [enteredbook, setEnteredBook] = React.useState("");
    const [enteredauthor, setEnteredAuthor] = React.useState("");
    const [newBookonShelf, setBookonShelf] = React.useState(false)
   

    // ADD A BOOK VIA FORM TO BOOKSHELF
    const addNewBooktoShelf = (event) => {
       
        function handleChange(newValue) {
            setShelfname(newValue);
            console.log("DID SHELF CHANGE", newValue, "SHELF TO BE PASSED", shelfname)
          }
    
        console.log('add book to shelf via form')
     
        const post = {"title": enteredbook, "author": enteredauthor, "shelf": shelfname}
        console.log("POSTING DATA")
        fetch('/api/bookshelf/addbook', {
            method: 'POST', 
            body: JSON.stringify(post),
            headers: {
              'Content-Type': 'application/json'
            }}
          )
          .then(response => response.json())
          .then(data => {
            const bookDetail= [];
            console.log("NEW BOOK DATA", data)
            bookDetail.push(<AddBookDetailItem key = {data.book_id} book_id={data.book_id} title={data.title} author={data.author}
                            publisher={data.publisher} image = {data.img} description={data.description} 
                            shelfname={shelfname} reading={props.reading} owned={props.owned}/> )
            
              console.log("PRINTING FROM FETCH PUSH", bookDetail)
              setBookonShelf(true)
            setBookDetail(bookDetail);
          
            } )
           
        console.log('HAS THE SHELFNAME CHANGED?!',  shelfname)
        event.preventDefault();
        console.log("NEW BOOK SHOULD SHOW UP", bookDetail);
        event.target.reset();
        
          } 
          history.push('/')
    return ( <React.Fragment>
                
                    <div className="col ">
                        <form className='form-add-book' onSubmit={addNewBooktoShelf}>
                            <h4>Add a Book via Title and Author</h4>
                            <div className="dropdown">
                                <label htmlFor="shelf-menu" className="dropbtn">Please choose a Bookshelf</label>
                                    <select name="shelfname" onChange={e => setShelfname(e.target.value)} className="dropdown-content">
                                            {props.shelves.map((name, index) =>
                                            <option key={index} value={name} onChange={e => setShelfname(e.target.value)}>{name}</option>)}
                                    </select>
                            </div>
                        

                            <div>
                                <label htmlFor="shelfname">Or create a bookshelf to add a book to </label>
                                  <input type="text" name="shelfname" onChange={e => setShelfname(e.target.value)} />
                            </div>
                            <div>
                                <label htmlFor="entertitle">Enter a Book Title </label>
                                <input type="text" name="enteredTitle" onChange={e => setEnteredBook(e.target.value)} /> 
                            </div>
                             <div>
                                <label htmlFor="enterauthor">Please enter Author name</label>
                                <input type="text"  name="enteredAuthor" onChange={e => setEnteredAuthor(e.target.value)} /> <br />
                            </div>
                            <   button type="submit"> Click here to add a Book to your shelf</button>
                        </form>
                    </div>
            
                <table>
                    <tbody>
                        {newBookonShelf && bookDetail }
                    </tbody>
                </table>
            </React.Fragment>
           )

}

// ------------- show the book detail to set reading status

function AddBookDetailItem(props) {
    let history = useHistory(); 
    const reading_st = props.reading
    

    const [readingStatus, setReadingStatus] = React.useState();
    const [ownedStatus, setOwnedStatus] = React.useState();

    console.log("IN ADDBOOKDETAILITEM", reading_st, props.shelfname,  props.owned)

    // function handleReading(newValue) {
    //     setReadingStatus(newValue);
    //   }

    // function handleOwned(newValue) {
    //     setOwnedStatus(newValue);
    //     console.log("HANDLEOWNED", ownedStatus)
    //   }
      const changeStatus = (event) => {
          
        const statuses_update = 
          {"reading_status": readingStatus, "owned_status": ownedStatus, "shelf": props.shelfname, "book_id": props.book_id }
    
        fetch('/update_status', {
          method: 'POST', 
          body: JSON.stringify(statuses_update),
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
         
            alert(`${data.shelved_book} added to Shelf ${props.shelfname}`)
          
        })
        console.log("UPDATING reading status", statuses_update)   
          event.preventDefault();
          console.log("sent to server??", statuses_update)
        }
        history.push('/')

    return <React.Fragment>
                <tr>
                    <td><img src={props.image}></img></td>
                    <td>{props.title}</td>
                    <td>{props.author}</td>
                    <td>{props.publisher}</td>
                </tr>
                <tr>
                    <td>{props.shelf}</td>
                    <td><label htmlFor="reading-menu" className="dropbtn">Reading Status</label>
                          <select name="reading-menu" onChange={e => setReadingStatus(e.target.value)} className="dropdown-content">
                                  {props.reading.map((status, index) =>
                                      <option key={index} value={status}>{status}</option>)}
                          </select></td>
                </tr>
                <tr>
                    <td><label htmlFor="book-menu" className="dropbtn">Book Status</label>
                          <select name="book-menu" onChange={e => setOwnedStatus(e.target.value)} className="dropdown-content">
                              {props.owned.map((name, index) =>
                                <option value={name} key={index}>{name}</option>)}
                          </select> </td>
                  {/*  <td><ReadingStatusMenu reading={reading_st} select_status ={true} handleReading={() => handleReading} /></td>
                    <td><BookStatusMenu owned={props.owned} select_status ={true} handleOwned={() => handleOwned} /></td> */}
                    <td><button onClick={changeStatus}>Update Book Statuses</button></td>
                    <td><Link to={`/book-info/${props.book_id}`}> Go to Book Page </Link></td>
                </tr>
            </React.Fragment>
    }

