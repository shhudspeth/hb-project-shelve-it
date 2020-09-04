const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { Modal } = ReactBootstrap;

/* 
function SendBooklistEmail(props){
        console.log("AT SENDLISTEMAIL", props)

        const sendBookEmail = (event) => {
                 
        console.log("SET TEXT SHELF", newValue, "SHELF TO BE PASSED", props.textShelf)

        const text = {"title": enteredbook, "author": enteredauthor, "shelf": props.textShelf}
        
        fetch(`/api/make-booklist/${textShelf}`, {
            method: 'POST', 
            body: JSON.stringify(text),
            headers: {
              'Content-Type': 'application/json'
            }}
          )
          .then(response => response.json())
          .then(data => {
            alert(`Thanks. Just sent you an email! ${data}`)
            } )
           
        
        event.preventDefault();
        event.target.reset();
          } 

          return( 
                <React.Fragment>
                           <h1>EMAIL WAS SENT WE THINK</h1>
                </React.Fragment>
          )} */

 
function DisplayShelf(props){
    let history = useHistory()
    let { shelfName } = useParams();

    // Fetches books from database and displays on site
    console.log(props.shelf, "IN DISPLAYSHELF", booksonShelfTable)
    const [selectShelf, setSelectShelf] = React.useState();

    if(shelfName) {
        setSelectShelf(shelfName);
    }
    else{
        setSelectShelf(props.shelf);
    }
    
    const [booksonShelfTable, setBooksonShelfTable] = React.useState([]);
    React.useEffect(() => {

        console.log("fetching books, shelves, reading statuses, owned statuses...")
        fetch(`/api/display-shelf/${selectShelf}`)
        .then(response => response.json())
        .then((data) => {
            
            //get book data
            const bookTable= [];
            for (const post of data.books) {
            
                bookTable.push(post)
                };
        
            setBooksonShelfTable(bookTable);
        
        })
        
        }, [props.shelf]);
        history.push(`/bookshelf/${shelfName}`)
        
        return(<FilterableBookshelfTable  bookTabs={booksonShelfTable} 
            reading={props.reading} owned={props.owned} 
            shelves={props.shelves}/>

        )

}

  
function BookDetailItem(props) {
        
    return <React.Fragment>

            <table>
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
        
                    <tr>
                        <td> <img src={props.image}></img></td>
                        <td>{props.title}</td>
                        <td>{props.author}</td>
                        <td>{props.publisher}</td>
                        <td>{props.description}</td>
                
                        <td><button>Edit Book</button></td>
                        <td><Link to={`/bookshelf`}> Go to BookShelf </Link></td>
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