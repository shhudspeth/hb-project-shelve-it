const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;

function Homepage() {
    return <div> Welcome to my site </div>
}

function About() {
    return <div> A tiny react demo site </div>
}

function ShoppingListItem(props) {
    return <li> {props.item} </li>
}

function Login(props) { 
  const [email, setEmail] = React.useState()
  // a form with no logic yet
  return (
    <div>
      Email:
      <input type="text"></input>
      Password:
      <input type="text"></input>
      <button> Login </button>
    </div>
  )
}

function Register() {
  // register a user in React

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
                {/* <li> */}
                    {/* <Link to="/bookshelf"> Your Bookshelf </Link>
                </li>
                <li>
                    <Link to="/upload_bookphoto"> Upload Books to Your Bookshelf </Link>
                </li>
                <li>
                    <Link to="/view_book_info"> View Book Info </Link>
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
            {/* <Route path="/bookshelf">
                <DisplayBookshelf />
              </Route> */}
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/top-posts">
                <PostList />
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