const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;

function Homepage() {
    return <div> Welcome to my site 
      < Login />
      < Register />
      < Bookshelf />
    </div>
}

function BookDetailItem(props) {
  return <li> 
              <img src={props.image} ></img>
              <b>{props.title}</b> 
              <p>{props.author}</p> 
              <i>{props.publisher}</i>
              <p>{props.description}
              <Link to={`/bookshelf`}> Go to Bookshelf </Link></p> </li>
  }

function ShowBookInfo(props) {
  const [bookInfo, setBookInfo] = React.useState();

  let { bookId } = useParams();
  console.log( bookId );
  

  React.useEffect(() => {
    console.log("fetching book detail info...")
    fetch(`/api/book_info/${bookId}`)
    .then(response => response.json())
    .then((data) => {
      const bookstuff = <BookDetailItem key = {data.book_id} book_id={data.book_id} title={data.title} author={data.author}
                       publisher={data.publisher} description={data.description}/>
    
       setBookInfo(bookstuff);
    })
    
  }, [])
  
  return <div> 
            <h2> BOOK info</h2>
            {bookInfo}

             </div>
}


// MAKES A BOOK FOR THE SHELF

function BookListItem(props) {
return <li> 
            <img src={props.image} ></img>
            <b>{props.title}</b> 
            <p>{props.author}</p> 
            <i>{props.publisher}</i>
            <p>{props.description}
            <Link to={`/book_info/${props.bookid}`}> Go to Book Page </Link></p> </li>
}

// STORES FUNCTIONS TO CREATE AND MODIFY AND DISPLAY A BOOKSHELF


function Bookshelf(props) {
  let history = useHistory();
  const [bookList, setBookList] = React.useState(["loading..."]);
  const [newBooks, setNewBooks] = React.useState();
  const [booksFile, setBooksFile] = React.useState()
  const [shelfname, setShelfname] = React.useState()
  const [enteredbook, setEnteredBook] = React.useState()
  const [enteredauthor, setEnteredAuthor] = React.useState()
 
  
  // Fetches books from database and displays on site
  React.useEffect(() => {
      console.log("fetching books...")
      fetch('/api/bookshelf')
      .then(response => response.json())
      .then((data) => {
        const bookList = [];
        for (const post of data) {
          
          bookList.push(<BookListItem key={post.book_id} bookid={post.book_id} title={post.title} author={post.author}
                         publisher={post.publisher} image={data.img} description={post.description}/>)
        }
       
        setBookList(bookList);
      })
    }, [])
    
  // upload a photo and scrape the text off of it
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
        history.push('/bookshelf')
      } 


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
            bookList.push(<BookListItem key={data.book_id} bookid={data.book_id} title={data.title} author={data.author}
              publisher={data.publisher} description={data.description} img ={data.img} />)
            

          setBookList(bookList);
            } )
            event.preventDefault();
            event.target.reset();
            history.push('/bookshelf')
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
          
          <div className='col'>
          <h2>Add a Book via Title and Author</h2>
          <form className='form-add-book' onSubmit={addNewBooktoShelf}> 

                <label htmlFor="shelfname">Please name or create a bookshelf to add books to </label>
                <input type="text" name="shelfname" onChange={e => setShelfname(e.target.value)} /> <br />

                <label htmlFor="entertitle">Enter a Book Title </label>
                <input type="text" name="enteredTitle" onChange={e => setEnteredBook(e.target.value)} /> 

                <label htmlFor="enterauthor">Please enter Author name</label>
                <input type="text"  name="enteredAuthor" onChange={e => setEnteredAuthor(e.target.value)} /> <br />

                <button type="submit"> Click here to add a Book to your shelf</button>
            </form>
          </div>

        </div>
        
        <h2>Books to Add</h2>
        <ul>
           {newBooks}
        </ul>
        <h2>Books on Your Shelf</h2>
        <ul>
           {bookList}
        </ul>

      </div>
    )
   
}


// LOGIN IN FUNCTIONS AND ROUTES

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
     
        alert(`${data.status}`)
      
    })
    console.log(login_user)
    event.preventDefault();
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

// REGISTER A NEW USER FUNCTIONS 

function Register() {
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


// SAMPLE POST ITEMS 


function PostListItem(props) {
  return <li>{props.title}</li>
}

function CreatePost(props) {
  // {"post_title": "post 1", "post_body": "stuf stuf stuf"}
  const [title, setTitle] = React.useState('')
  const [body, setBody] = React.useState('')

  const makePost = () => {
    const post = {"post_title": title, "post_body": body}
    fetch('/api/post', {
      method: 'POST', 
      body: JSON.stringify(post),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data === 'not ok') {
        alert('post title already taken')
      }
    })
  }

  return (
    <div>
      Title:
      <input 
        type="text" 
        onChange={(e) => setTitle(e.target.value)}
        value={title} 
      />
      Body:
      <textarea 
        onChange={(e) => setBody(e.target.value)}
        value={body}
      />
      <button onClick={makePost}> Make Post </button>
    </div>
  )
}

function PostList(props) {
    // get the info from the server
    // make componenets out of it 
    // render them 
    const [topPostList, setTopPostList] = React.useState(["loading..."])

    React.useEffect(() => {
      fetch('/api/top-posts')
      .then(response => response.json())
      .then((data) => {
        const postList = []
        for (const post of data) {
          postList.push(<PostListItem title={post.title}/>)
        }
        setTopPostList(postList)
      })
    }, [])

    return (
      <div>
        <SearchBox />
        <ul>
           {topPostList}
        </ul>
      </div>
    )
}


// MAIN ROUTER AND SWITCH APP

function App() {
    return (
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                    <Link to="/"> Home </Link>
                </li>
                <li>
                    <Link to="/register"> Register </Link>
                </li>
                <li>
                    <Link to="/login"> Login </Link>
                </li>
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
              <Route path="/bookshelf">
                <Bookshelf />
              </Route> 
              <Route path="/register">
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