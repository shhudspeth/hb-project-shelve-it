const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { Modal } = ReactBootstrap;


 
function DisplayShelf(props){
    let history = useHistory();
    // let { shelfName } = useParams();

    const [booksonShelfTable, setBooksonShelfTable] = React.useState([]);
    console.log(props.shelf, "IN DISPLAYSHELF",  booksonShelfTable)


    
    React.useEffect(() => {
        
        console.log("fetching books from one shelf.")
        fetch(`/api/display-shelf/${props.shelf}`)
        .then(response => response.json())
        .then((data) => {
            
            //get book data
            const shelfTable= [];
            for (const post of data.books) {
                console.log(post);
                shelfTable.push(post);
                };
        
            setBooksonShelfTable(shelfTable);
            console.log('ADD BOOKS FROM A SPECIFIC SHELF', booksonShelfTable);
        
        })
        
        }, [props.shelf]);
        history.push(`/`)
        
        return(<FilterableBookshelfTable  bookTabs={booksonShelfTable} shelf={props.shelf}
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