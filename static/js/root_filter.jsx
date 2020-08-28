const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { Modal } = ReactBootstrap;




  
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
                    <tr>
                        {props.description}
                    </tr>
                    <tr>
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


//--------------------- SEARCH BAR  --------------------// 

function SearchBar (props) {
    return <form>
        <input type="text" placeholder="Search.." />
        <p><input type="checkbox" /> {' '} <ReadingStatusMenu reading={props.reading} /></p>
        <p><input type="checkbox" /> {' '} <BookStatusMenu owned={props.owned} /></p>
        </form>

}

//--------------------- READING STATUS MENU --------------------// 

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

//--------------------- READING STATUS MENU --------------------// 

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
//---------------------OWNED STATUS MENU--------------------//

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

//---------------------BOOKTABLE FOR BOOKSHELF TABLE--------------------//
function BookTable(props){
    const rows=[];
    
    props.books.forEach((book) => {
        rows.push(<BookRow book={book} key={book.book_id} />)

    });
    return <table>
                <thead>
                    <tr>
                        <th>Book </th>
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

//---------------------BOOK ROW for BOOK TABLE--------------------//
function BookRow(props){
    const bookData = props.book;
    console.log("BOOKROW")
    
    return (
            <tr>
                <td><img src={bookData.img}></img></td>
                <td><Link to={`/book-info/${bookData.book_id}`} >{bookData.title}</Link></td>
                <td>{bookData.author}</td>
                <td>{bookData.publisher}</td>
                <td>{bookData.reading_stat}</td>
                <td>{bookData.owned_stat}</td>
                <td>{bookData.shelf_name}</td>
                <td><button>Edit Book</button></td>
                <td><Link to={`/book-info/${bookData.book_id}`}> Go to Book Page </Link></td>
            </tr>
    )
}

//---------------------Bookshelf Table Component--------------------//

function FilterableBookshelfTable (props) {
    return (
        <div>
            <h4>Search Bar and Sort Methods</h4>
            <ReadingStatusMenu reading={props.reading}  />
            <ShelvesListMenu key={1} shelves={props.shelves} />
            <SearchBar reading={props.reading} owned={props.owned} />
            <h2>Books on Your Shelf</h2>
            <BookTable books={props.bookTabs} />
        </div>
            
            )
    
}




  
//---------------------HOMEPAGE--------------------//

function Homepage(props) {
  
    // Sets some state Variables and props variables
    console.log(props.loggedIn, "checking rendering value")
    
    return (
    <div>
        <h1>Welcome to Shelve-It</h1>
        <h2> a place to keep track of your reading needs </h2>
            {!props.loggedIn && <Login loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
            {!props.loggedIn && <Register /> }
            {props.loggedIn && <Logout loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
            <UploadAPhoto />
            <AddaBook reading={props.reading} owned={props.owned} shelves={props.shelves} />
            <FilterableBookshelfTable books={props.books} bookTabs={props.bookTabs} 
                                        reading={props.reading} owned={props.owned} 
                                        shelves={props.shelves}/>
         
      
    </div>)
  }
 

// MAIN ROUTER AND SWITCH APP

function App(props) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    let cookieValue = document.cookie
    console.log(cookieValue);

    
    const [bookList, setBookList] = React.useState(["loading..."]);
    const [shelvesList, setShelvesList] = React.useState([]);
    const [reading_stats, setReadingStats] = React.useState([]);
    const [owned_stats,setOwnedStats] = React.useState([]);
    const [bookTable, setBookTable] = React.useState([]);
    // Fetches books from database and displays on site


      function handleLogin(newValue) {
        setIsLoggedIn(newValue);
      }
    
    console.log("LOGGED IN", isLoggedIn)

    React.useEffect(() => {
        console.log("fetching books, shelves, reading statuses, owned statuses...")
        fetch('/api/bookshelf')
        .then(response => response.json())
        .then((data) => {
            if (data.user) {
                setIsLoggedIn(true)
                console.log(data.user)
            }
            
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
            const shelvesList = [];
            for (const shelf of data.shelves) {
                shelvesList.push(shelf.name)
            };
            setShelvesList(shelvesList)
            
            //get book data
            const bookTable= [];
            for (const post of data.books) {
            
                bookTable.push(post)
                };
        
            setBookTable(bookTable);
        
        })
        
        }, []);
        
  
   
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/"> Home </Link>
                        </li>
                        <li> 
                            <Link to="/bookshelf"> Your Bookshelf </Link>
                        </li>
                        <li>
                            <Link to="/upload-bookphoto"> Upload Books to Your Bookshelf </Link>
                        </li> 
                        
                    </ul>
                </nav>
                <Switch>

                    <Route path="/register" >
                        <Register />
                    </Route>
                    
                    <Route path="/login">
                        <Login loggedIn={isLoggedIn} handleLogin={() =>handleLogin} />
                    </Route>

                    <Route path="/logout">
                        <Logout loggedIn={isLoggedIn} handleLogin={() =>handleLogin} />
                    </Route>
            
                    <Route path="/upload-book-photo">
                        <UploadAPhoto />
                    </Route>
                    
                    <Route path="/bookshelf">
                        <FilterableBookshelfTable loggedIn={isLoggedIn} handleLogin={() =>handleLogin} books={bookList} bookTabs={bookTable} reading={reading_stats} owned={owned_stats} shelves={shelvesList} />
                    </Route> 

                    <Route path="/book-info/:bookId">
                        <ShowBookInfo />
                    </Route>
        
                    <Route path="/">
                        <Homepage loggedIn={isLoggedIn} handleLogin={() =>handleLogin} books={bookList} bookTabs={bookTable} reading={reading_stats} owned={owned_stats} shelves={shelvesList} />
                    </Route>
                 </Switch>
            </div>
        </Router>
        );
  
  } 
  ReactDOM.render(<App />, document.getElementById('root'))
