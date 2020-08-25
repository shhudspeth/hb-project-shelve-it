const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;




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
        // React.useEffect(() => {
        //   console.log("fetching status options...")
        //   fetch('/api/bookshelf')
        //   .then(response => response.json())
        //   .then((data) => {
        //     const reading_st = data.reading_st;
        //     const owned_st = data.owned_st
        //     ;
        //   })
        // }, [])

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
        history.push('/')
          } 

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
        history.push('/')
        console.log("NEW BOOKS", newBooks)
      } 

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



// REGISTER A NEW USER FUNCTIONS 

function Register(props) {
    // register a user in React
  
    let history = useHistory();
  
    const [email, setEmail] = React.useState();
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [displayPublic, setDisplayPublic] = React.useState();
    const [emailTextMethod, setEmailTextMethod] = React.useState();
    const [phoneNumber, setPhoneNumber] = React.useState();
    const [zipcode, setZipcode] = React.useState();
  
  
    const handleSubmit = (event) => {
  
      const register_user = 
        {"email": email, "password": password, "username": username, 
          "public_shelf": displayPublic, "email_or_text": emailTextMethod, 
          "phone_number": phoneNumber, "zipcode": zipcode }
  
      fetch('/register', {
        method: 'POST', 
        body: JSON.stringify(register_user),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
       
          alert(`${data.message}`)
         
      function handleRegister(event) {
        // Here, we invoke the callback with the new value
        props.onRegister(event.target.value);
    }
  
  
        
      })
      console.log(register_user)

        
        event.preventDefault();
        history.push('/')
      }
    return (
      <form className="form-register" onSubmit={handleSubmit}>
  
        <h2 className="form-register">Please Register your Shelve-It Account</h2>
  
          <div className="form-group">
            <label htmlFor="text-field" className="sr-only">Username</label>
            <input type="text"
                name="user_name"
                className="form-control input-lg"
                // value = {username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Username"
                required
                autoFocus />
          </div>
  
           <div className="form-group">
            <label htmlFor="email-field" className="sr-only">Email Address</label>
            <input type="email"
                  name="email"
                  // value = {email}
                  onChange={e => setEmail(e.target.value)}
                  className="form-control input-lg"
                  placeholder="Email Address"
                  required
                  autoFocus />
          </div>
  
          <div className="form-group">
            <label htmlFor="password-field" className="sr-only">Password</label>
            <input type="password"
                  name="password"
                  // value = {password}
                  onChange={e => setPassword(e.target.value)}
                  className="form-control input-lg"
                  placeholder="Password"
                  required />
          </div>
          
          <div className="form-group">
            <p>Your Display Setting: 
            
            <input type="radio"
                  name="public"
                  value="True"
                  onChange={e => setDisplayPublic(e.target.checked)}
                  className="form-control input-lg"
                  required />
            <label htmlFor="public" className="sr-only">Public Shelf</label>
            
            <input type="radio"
                  name="public"
                  value="False"
                  onChange={e => setDisplayPublic(e.target.checked)}
                  className="form-control input-lg"
                  required /> 
            <label htmlFor="public" className="sr-only">Private Shelf</label></p>
          </div>
  
          <div className="form-group">
            <p>How should we send you Books on your Shelf?
            <label htmlFor="text" className="sr-only">Text </label>
            <input type="radio"
                    name="communicate"
                    value="text_phone"
                    onChange={e => setEmailTextMethod(e.target.value)}
                    className="form-control input-lg"
                    required />
            <label htmlFor="email_list" className="sr-only">Email</label>
            <input type="radio"
                  name="communicate"
                  value="email_list"
                  onChange={e => setEmailTextMethod(e.target.value)}
                  className="form-control input-lg"
                  required />
            <label htmlFor="email_list" className="sr-only">Both</label>
            <input type="radio"
                  name="communicate"
                  value="both"
                  onChange={e => setEmailTextMethod(e.target.value)}
                  className="form-control input-lg"
                  required />
            <label htmlFor="email_list" className="sr-only">Online access only</label>
            <input type="radio"
                  name="communicate"
                  value="neither"
                  onChange={e => setEmailTextMethod(e.target.value)}
                  className="form-control input-lg"
                   /> </p>
          </div>
  
          <div className="form-group">
          <label htmlFor="phone">If you want us to text you your books, please enter your phone number(optional):</label>
          <input type="tel" 
                id="phone" 
                name="phone"
                // value = {phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="555-555-5555"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />
          </div>
  
          <div className="form-group">
            <label htmlFor="zip_code" className="sr-only">If you would like us to find local libraries or bookstores, please enter a zip code(optional):</label>
            <input type="text" 
                  name="zip_code" 
                  // value = {zipcode}
                  onChange={e => setZipcode(e.target.value)}
                  placeholder="your zip code"  
                  pattern="^\s*?\d{5}(?:[-\s]\d{4})?\s*?$" />
  
          </div>
          <p></p>
          <button className="btn btn-lg btn-primary btn-block">Register
          </button>
      </form>
    )
  }


// LOGOUT IN FUNCTIONS AND ROUTES

function Logout(props) { 
    let history = useHistory();
    
  
    const handleSubmit = (event) => {
  
      const logout_user = {"logout": true}
  
      fetch('/logout', {
        body: JSON.stringify(login_user),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
       
          alert(`${data.status}`);
          setIsLoggedIn(false)
        
        })
        console.log(logout_user)
        event.preventDefault();
        
        
        //   setIsRegistered(true)
        history.push('/')
      }
  
    // a form 
    return (
      <form className="form-signout" onSubmit={handleSubmit}>
  
          <h2 className="form-signout-heading">Logout</h2>
  
          <button className="btn btn-lg btn-primary btn-block">Log out</button>
  
        </form>
    )
  }
  


function Login(props) { 
    let history = useHistory();
    const [email, setEmail] = React.useState()
    const [password, setPassword] = React.useState()
     
  
    const handleSubmit = (event) => {


      const login_user = 
        {"email": email, "password": password }
  
      fetch('/login', {
        method: 'POST', 
        body: JSON.stringify(login_user),
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(response => response.json())
      .then(data => {
       
          alert(`${data.status}`);

          props.handleLogin(true);
        }
      )
        
      
      console.log("LOGIN USER", login_user);
      event.preventDefault();
    
    //   setIsLoggedIn(true)
    //   setIsRegistered(true)
      history.push('/')
      }
  
    // a form 
    return (
      <form className="form-signin" onSubmit={handleSubmit}>
  
          <h2 className="form-signin-heading">Please Sign In</h2>
  
          <div className="form-group">
            <label htmlFor="email-field" className="sr-only">Email Address</label>
            <input type="email"
                  name="email"
                  className="form-control input-lg"
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  autoFocus />
          </div>
  
          <div className="form-group">
            <label htmlFor="password-field" className="sr-only">Password</label>
            <input type="password"
                  name="password"
                  className="form-control input-lg"
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required />
          </div>
  
          <button className="btn btn-lg btn-primary btn-block">Sign In
          </button>
  
        </form>
    )
  }
  
//---------------------HOMEPAGE--------------------//

function Homepage(props) {
  
    // Sets some state Variables and props variables
    const [isLoggedIn, setIsLoggedIn] = React.useState();
   

    let history = useHistory();
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
            
            //get book data
            const bookTable= [];
            for (const post of data.books) {
            
                bookTable.push(post)
                };
        
            setBookTable(bookTable);
        
        })
        
        }, []);
        history.push('/')
    
    return (
    <div>
        <h1>Welcome to Shelve-It</h1>
        <h2> a place to keep track of your reading needs </h2>
            {!isLoggedIn && <Login loggedIn={isLoggedIn} handleLogin={handleLogin} /> }
            {!isLoggedIn && <Register /> }
            <UploadAPhoto />
            <AddaBook reading={reading_stats} owned={owned_stats} shelves={shelvesList} />
            <FilterableBookshelfTable books={bookList} bookTabs={bookTable} reading={reading_stats} owned={owned_stats} shelves={shelvesList}/>
         
      
    </div>)
  }
 

// MAIN ROUTER AND SWITCH APP

function App(props) {
  
   
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
                        <li> 
                            <Link to="/logout"> Logout </Link>
                        </li>
                    </ul>
                </nav>
                <Switch>

                    <Route path="/register" >
                        <Register />
                    </Route>
                    
                    <Route path="/login">
                        <Login />
                    </Route>

                    <Route path="/logout">
                        <Logout />
                    </Route>
            
                    <Route path="/upload-book-photo">
                        <UploadAPhoto />
                    </Route>
                    
                    <Route path="/bookshelf">
                        <FilterableBookshelfTable />
                    </Route> 

                    <Route path="/book-info/:bookId">
                        <ShowBookInfo />
                    </Route>
        
                    <Route path="/">
                        <Homepage />
                    </Route>
                 </Switch>
            </div>
        </Router>
        );
  
  } 
  ReactDOM.render(<App />, document.getElementById('root'))
