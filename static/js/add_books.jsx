const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;



// ---------------------UPLOAD A PHOTO AND GET BOOK INFORMATION -------
function UploadAPhoto(props){
    // upload a photo and scrape the text off of it
   let history = useHistory();
   const [shelfname, setShelfname] = React.useState("");
   const [booksFile, setBooksFile] = React.useState("");
   const [newBooks, setNewBooks] = React.useState();
   
   const uploadBookPhoto = (event) => {
   console.log('trying to add books to page')
 
     const post = {"filepath": booksFile, "shelfname": shelfname}
     console.log("POSTING DATA")
     fetch('/api/bookshelf', {
       method: 'POST', 
       body: JSON.stringify(post),
       headers: {
         'Content-Type': 'application/json'
       }}
     )
     .then(response => response.json())
     .then(data => {
       setNewBooks(data)
       })
       event.preventDefault();
       event.target.reset();
       
       console.log("NEW BOOKS", newBooks)
     } 
     history.push('/')
     return (
     <div>
         <div className="row">
           <div className="col">
            <h2>Add a Book via Photo Upload</h2>
             <form className='form-upload' onSubmit={uploadBookPhoto}> 
               <label htmlFor="shelfname">Please name or create a bookshelf to add books to </label>
               <input type="text" name="shelfname" onChange={e => setShelfname(e.target.value)} /> <br />
               <label htmlFor="fileElem">Select an image of a stack of books</label>
               <input type="file" id="bookstack" name="booksFile" onChange={e => setBooksFile(e.target.value)} accept="image/png, image/jpeg" encType="multipart/form-data" /> <br />
               <button type="submit"> Click here to upload</button>
             </form>
           </div>
       
         </div>
         </div>
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
    const current_shelves = props.shelves 

    // ADD A BOOK VIA FORM TO BOOKSHELF
    const addNewBooktoShelf = (event) => {
        
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
                            shelves ={current_shelves}reading={props.reading} owned={props.owned}/> )
            
              console.log("PRINTING FROM FETCH PUSH", bookDetail)
              setBookonShelf(true)
            setBookDetail(bookDetail);
          
            } )
        event.preventDefault();
        console.log("NEW BOOK SHOULD SHOW UP", bookDetail);
        event.target.reset();
        
          } 
          history.push('/')
    return (<div>
            <form className='form-add-book' onSubmit={addNewBooktoShelf}> 
                <h2>Add a Book via Title and Author</h2>
                <label htmlFor="shelfname">Please name or create a bookshelf to add books to </label>
                    <input type="text" name="shelfname" onChange={e => setShelfname(e.target.value)} /> <br />
                <label htmlFor="entertitle">Enter a Book Title </label>
                    <input type="text" name="enteredTitle" onChange={e => setEnteredBook(e.target.value)} /> 
                <label htmlFor="enterauthor">Please enter Author name</label>
                    <input type="text"  name="enteredAuthor" onChange={e => setEnteredAuthor(e.target.value)} /> <br />
                <button type="submit"> Click here to add a Book to your shelf</button>
            </form>
            <table>
                <tbody>
                    {newBookonShelf && bookDetail }
                </tbody>
            </table>
            </div>)

}

// ------------- show the book detail to set reading status

function AddBookDetailItem(props) {
    const reading_st = props.reading
    console.log("IN BOOKDETAILITEM", reading_st, props.shelves, props.owned)
    return <React.Fragment>
                <tr>
                    <td><img src={props.image}></img></td>
                    <td>{props.title}</td>
                    <td>{props.author}</td>
                    <td>{props.publisher}</td>
                    <td><ReadingStatusMenu reading={reading_st} /></td>
                    <td><BookStatusMenu owned={props.owned} /></td>
                    <td><ShelvesListMenu shelves={props.shelves}/></td>
                    <td><button>Edit Book</button></td>
                    <td><Link to={`/book-info/${props.book_id}`}> Go to Book Page </Link></td>
                </tr>
            </React.Fragment>
    }