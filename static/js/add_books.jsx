const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;


function BookDetailItem(props) {
    let history = useHistory();

    const [comment, setComment] = React.useState("")

    const [commentList, setCommentList]= React.useState(props.comments)


    console.log("WHERE ARE THE COMMENTS", props.comments);
        for (const comment of props.comments){
            console.log(comment.text, comment.user, "HERE ARE THE COMMENT TEXTS");
        }

    const handleSubmit = (event) => {

        const addComment = {"comment_text": comment, "book_id": props.book_id }
    
        fetch(`/api/book_info/${props.book_id}`, {
          method: 'POST', 
          body: JSON.stringify(addComment),
          headers: {
            'Content-Type': 'application/json'
          },
        })
        .then(response => response.json())
        .then(data => {
            const new_comments=[]
            for (const comment of data.comments){
                new_comments.push(comment);
            }
            setCommentList(new_comments)
            alert(`New comment added !`)
            
          
        })
        
          event.preventDefault();
          event.target.reset();
            
          
        }

    history.push(`/book-info/${props.book_id}`)


    return <React.Fragment>

            <div className="container">
                <div className="row">
                    <div className="col-5">Book Cover</div>
                    

                    <div className="col-6">  
                        <div className = "row">
                            <div className="col">Title</div>
                            <div className="col">Author</div>
                            <div className="col">Publisher</div>
                        </div>
                    </div>

                    <div className="row"> 
                        <div className="col-5"></div>
                            <img src={props.image}></img>
                        </div> 
                   
                        <div className="col-6 offset-3">
                            <div className="row">
                                <div className="col">{props.title}</div>
                                <div className="col">{props.author}</div>
                                <div className="col">{props.publisher}</div>
                            </div>
                            <div className="row" id="book-description">
                                <div className="col">{props.description}</div>
                            </div>
                        </div>
                    </div>
                </div>
                       
                    
                   
            
           
                    
                    <div className='container' id="comments-list">
                    <b>COMMENTS</b>
                        <div className='row' id="comments-header">
                            <div className='col'>User </div> 
                            <div className='col'>Post Date</div> 
                            <div className='col'>Comment </div> 

                        </div>
                        
                   
                            {commentList.map((comment,index) => { 
                                return  (
                                        <div  className='row' key={index}> 
                                            <div className='col'>{comment.user} </div> 
                                            <div className='col'>{comment.post_date}</div> 
                                            <div className='col'>{comment.text}</div>
                                        </div>
                                            ) }
                        
                            )}    

                        <div className='row' id="add_comment">
                            <form id="bookcomment">
                            <div className='col'> <label htmlFor='comment'>Comment Here!</label></div>
                            <div className="col">
                            <textarea name="comment" onChange={e => setComment(e.target.value)} form="bookcomment"> </textarea></div>
                            <div className="col"><button onClick={handleSubmit}> Submit Comment</button></div>
                            </form>
                        </div>
                    </div>


                   
                    <div className='container'>
                        <div  className='row'>
                            <div className='col offset-8'><button>Edit Book</button></div>
                            <div className='col'> <button><Link to={`/bookshelf`}>Go to BookShelf</Link></button> </div>
                        </div>
                    </div>
              
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
                                        description={data.description} comments={data.comments}/>
      
         setBookInfo(bookstuff);
      })
    }, []);
    
    return <div> 
              <h2> Book Info</h2>
              
                    {bookInfo}
              
            </div>
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
            
              console.log("PRINTING FROM FETCH PUSH ADD BOOK", bookDetail)
              setBookonShelf(true)
            setBookDetail(bookDetail);
            
          
            } )
           
        console.log('HAS THE SHELFNAME CHANGED?!',  shelfname)
        event.preventDefault();
        console.log("NEW BOOK SHOULD SHOW UP", bookDetail);
        event.target.reset();
        props.handleAddaBook(false)
        console.log("IS TIS CHANGING HANDLEADDABOOK TO FALSE?", props.handleAddaBook(false))
          } 
          history.push('/')
    return ( <React.Fragment>
                
                    <div className="col ">
                        <form className='form-add-book' onSubmit={addNewBooktoShelf}>
                            <h4>Add a Book via Title and Author</h4>
                            <div className="dropdown">
                                <label htmlFor="shelf-menu" className="dropbtn">Please choose a Bookshelf </label>
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
                                <label htmlFor="entertitle">Enter a Book Title: </label>
                                <input type="text" name="enteredTitle" onChange={e => setEnteredBook(e.target.value)} /> 
                            </div>
                             <div>
                                <label htmlFor="enterauthor">Please enter Author name </label>
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
    const[resetBookDetail, setResetBookDetail]= React.useState(false);

    console.log("IN ADDBOOKDETAILITEM", reading_st, props.shelfname,  props.owned)

      const changeStatus = (event) => {
        setResetBookDetail(false)
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
          setResetBookDetail(true)
        }
        history.push('/')

    return ( !resetBookDetail &&
         <React.Fragment>
                <tr>
                    <td><img src={props.image}></img></td>
                    <td>{props.title}</td>
                    <td>{props.author}</td>
                    <td>{props.publisher}</td>
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
                    <td><button onClick={changeStatus}>Update Book Statuses</button></td>
                    
                </tr>
            </React.Fragment> )
    }

