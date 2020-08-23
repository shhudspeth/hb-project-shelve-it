const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;



function SearchBar (props) {
    return <form>
        <input type="text" placeholder="Search.." />
        <p><input type="checkbox" /> {' '} <ReadingStatusMenu reading={props.reading} /></p>
        <p><input type="checkbox" /> {' '} <BookStatusMenu owned={props.owned} /></p>
        </form>

}

function BookListItem(props) {

    return <li> 
                <img src={props.image} ></img>
                <b>{props.title}</b> 
                <p>{props.author}</p> 
                <i>{props.publisher}</i> <br />
                <b><i>{props.reading_st}</i></b> <br />
                <b><i>{props.owned_st}</i></b>
                <p>{props.description}
                {/* <Link to={`/book_info/${props.bookid}`}> Go to Book Page </Link> */}
                </p>
                </li>
    }

function ShelvesListMenu(props){
    
    return (<div>
                <div className="dropdown">
                    <label htmlFor="shelf-menu" className="dropbtn">Please choose a Bookshelf</label>
                        <select name="shelf-menu" className="dropdown-content">
                            <option key="all" name="all">All shelves</option>
                            {props.shelves.map((name, index) =>
                                <option key={index} value={name}>{name}</option>)}
                        </select>
                </div>
            </div>
    )
    }

function ReadingStatusMenu(props){
    
    return (
            <React.Fragment>
            <label htmlFor="reading-menu" className="dropbtn">Reading Status</label>
                <select name="reading-menu" className="dropdown-content">
                    {props.reading.map((status, index) =>
                        <option key={index} value={status}>{status}</option>)}
                </select>
                </React.Fragment>
      
)
}

function BookStatusMenu(props){
    return (
        <React.Fragment>
            <label htmlFor="book-menu" className="dropbtn">Book Status</label>
                <select name="book-menu" className="dropdown-content">
                    {props.owned.map((name, index) =>
                        <option value={name} key={index}>{name}</option>)}
                </select>
                </React.Fragment>
)
}


function BookTable(props){
    const rows=[];
    
    props.books.forEach((book) => {
        rows.push(<BookRow book={book} key={book.book_id} />)

    });
    return <table>
                <thead>
                    <tr>
                        <th>Book Cover</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Publisher</th>
                        <th>Reading Status</th>
                        <th>Book Status</th>
                        <th>On Shelf</th>
                        <th>Edit Options</th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
             </table>

}

function BookRow(props){
    const bookInfo = props.book
    
    return (
            <tr>
                <td><img src={bookInfo.img}></img></td>
                <td>{bookInfo.title}</td>
                <td>{bookInfo.author}</td>
                <td>{bookInfo.publisher}</td>
                <td>{bookInfo.reading_stat}</td>
                <td>{bookInfo.owned_stat}</td>
                <td>{bookInfo.shelf}</td>
                <td><button>Edit Book</button></td>
            </tr>
        
    )

}

function FilterableBookshelfTable (props) {
    return (
        <div>
            <ReadingStatusMenu reading={props.reading}  />
            <ShelvesListMenu key={1} shelves={props.shelves} />
            <SearchBar reading={props.reading} owned={props.owned} />
            <BookTable books={props.bookTabs} />
            <h2>Books on Your Shelf</h2>
               <ul>{props.books}</ul>


        {/* {props.books}<br></br> 
        {props.reading}<br /> 
        {props.shelves}<br />
        {props.owned}<br /> */}
            </div>
            
            )
    
}


    
function Homepage() {
  
    // Sets some state Variables and props variables
    let history = useHistory();
    const [bookList, setBookList] = React.useState(["loading..."]);
    const [shelvesList, setShelvesList] = React.useState([]);
    const [reading_stats, setReadingStats] = React.useState([]);
    const [owned_stats,setOwnedStats] = React.useState([]);
    const [bookTable, setBookTable] = React.useState([]);
    // Fetches books from database and displays on site

    React.useEffect(() => {
        console.log("fetching books, shelves, reading statuses, owned statuses...")
        fetch('/api/bookshelf')
        .then(response => response.json())
        .then((data) => {
            
            // going to be a prop... not need to update
            for (const stat of data.reading_st_list) {
                reading_stats.push(stat.reading_status)   
            };
            setReadingStats(reading_stats)

             // going to be a prop... not need to update
            for (const stat of data.owned_st_list) {
                owned_stats.push(stat.owned_status)   
            };
            setOwnedStats(owned_stats)

             // going to be a State should be able to update
            const shelves = [];
            for (const shelf of data.shelves) {
                shelves.push(shelf.name)
            };
            setShelvesList(shelves)

            
            const bookList = [];
            for (const post of data.books) {
            
                bookList.push(<BookListItem key={post.book_id} bookid={post.book_id} title={post.title} author={post.author}
                        publisher={post.publisher} shelf={post.shelf_name} owned_st={post.owned_stat} image={post.img}
                        reading_st={post.reading_stat} description={post.description} reading={reading_stats} owned={owned_stats} />)
                };

            const bookTable= [];
            for (const post of data.books) {
            
                bookTable.push(post)
                };
        
            setBookTable(bookTable);
            console.log(bookTable);
           
        })
        
        }, []);
    
    return (
    <div>
       < FilterableBookshelfTable books={bookList} bookTabs={bookTable} reading={reading_stats} owned={owned_stats} shelves={shelvesList}/>
        {/* <Login />
        <Register />  */}
      
    </div>)
  }


 

// MAIN ROUTER AND SWITCH APP

function App() {
    const [isLoggedIn, setIsLoggedIn] = React.useState()
    const [isRegistered, setIsRegistered] =React.useState()
    
   
  
      return (
          <Router>
            <div>
              <nav>
                <ul>
                  <li>
                      <Link to="/"> Home </Link>
                  </li>
                  {/* <li>
                      <Link to="/register"> Register </Link>
                  </li>
                  <li>
                      <Link to="/login"> Login </Link>
                  </li> */}
                  <li> 
                      <Link to="/bookshelf"> Your Bookshelf </Link>
                  </li>
                  {/* <li>
                      <Link to="/upload_bookphoto"> Upload Books to Your Bookshelf </Link>
                  </li> */}
                  {/* <li>
                      <Link to="/send_book_info"> Your Bookshelf </Link>
                  </li> */}
                  {/* <li>
                      <Link to="/logout"> Logout </Link>
                  </li> */}
                </ul>
              </nav>
              <Switch>
                <Route path="/">
                  <Homepage />
                </Route>
                <Route path="/bookshelf">
                  <FilterableBookshelfTable />
                </Route> 
                {/* <Route path="/register">
                  <Register />
                </Route>
                <Route path="/top-posts">
                  <PostList />
                </Route>
                <Route path="/book_info/:bookId">
                  <ShowBookInfo />
                </Route>
                <Route path="/login">
                  <Login />
                </Route> */}
              
             
              </Switch>
            </div>
          </Router>
        );
  
  }
  
  ReactDOM.render(<App />, document.getElementById('root'))