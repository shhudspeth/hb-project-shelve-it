const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;


// --------------- NavBar Component ------------------------- //

// function NavBar(props) {

// return(
//   <div className="navbar">
//     {!props.loggedIn && <Login loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
//     {!props.loggedIn && <Register loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
//     {props.loggedIn && <Logout loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
//   </div>
// )
// }



// ----------------- REGISTER A NEW USER FUNCTIONS -------------------- //

function Register(props) {
    // register a user in React
  
    let history = useHistory();

    const [email, setEmail] = React.useState();
    const [username, setUsername] = React.useState();
    const [password, setPassword] = React.useState();
    const [displayPublic, setDisplayPublic] = React.useState();
    const [emailTextMethod, setEmailTextMethod] = React.useState();

    const [email, setEmail] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");

    const [displayPublic, setDisplayPublic] = React.useState(true);
    const [emailTextMethod, setEmailTextMethod] = React.useState(false);
    const [phoneNumber, setPhoneNumber] = React.useState("111-111-1111");
    const [zipcode, setZipcode] = React.useState("11111");
    const {loggedIn, setLoggedIn} = React.useContext(LoginComplete);
  
    console.log("IN REGISTER")
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
       
          alert(`${data.message}`); 
          setLoggedIn(true);
          history.push(`/`)
        
      })
      console.log(register_user, loggedIn)   
        event.preventDefault();
       history.push(`/`
      }
      history.push(`/register`)
    return (
      <form className="form-register" onSubmit={handleSubmit}>
  
        <h2 className="form-register">Please Register your Shelve-It Account</h2>
          <div className="container register">
            <div className="form-group">
              <label htmlFor="text-field" >Username</label>
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
              <label htmlFor="email-field">Email Address</label>
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
              <label htmlFor="password-field" >Password</label>
              <input type="password"
                    name="password"
                    // value = {password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-control input-lg"
                    placeholder="Password"
                    required />
            </div>
            
            <div className="form-group">
                <h3>Your Display Setting:</h3>
                <div className="row publicshelf">
                  <div className= "col publicshelf">
                    <label htmlFor="public" >Public Shelf</label>
                    <input type="radio"
                        name="public"
                        value="True"
                        onChange={e => setDisplayPublic(e.target.checked)}
                        className="form-control input-lg"
                        required />
                    </div>
                  
                  <div className= "col publicshelf">
                    <label htmlFor="public" >Private Shelf</label>
                    <input type="radio"
                        name="public"
                        value="False"
                        onChange={e => setDisplayPublic(e.target.checked)}
                        className="form-control input-lg"
                        required /> 
                  </div>         
                </div>
            </div>
    
            <div className="form-group">
                <h3>How should we send you Books on your Shelf?</h3>
                <div className="row communicationpref">
                {/* <div className="col communicationpref">
                  <label htmlFor="text">Text </label>
                  <input type="radio"
                          name="communicate"
                          value="text_phone"
                          onChange={e => setEmailTextMethod(e.target.value)}
                          className="form-control input-lg"
                          required />
                </div> */}
                <div className="col communicationpref">
                  <label htmlFor="email_list">Email</label>
                  <input type="radio"
                        name="communicate"
                        value="email_list"
                        onChange={e => setEmailTextMethod(e.target.value)}
                        className="form-control input-lg"
                        required />
                  </div>
                  {/* <div className="col communicationpref">
                  <label htmlFor="email_list" >Both</label>
                  <input type="radio"
                        name="communicate"
                        value="both"
                        onChange={e => setEmailTextMethod(e.target.value)}
                        className="form-control input-lg"
                        required /> 
                      </div>*/}

                  <div className="col communicationpref">
                    <label htmlFor="email_list" >Online access only</label>
                    <input type="radio"
                          name="communicate"
                          value="neither"
                          onChange={e => setEmailTextMethod(e.target.value)}
                          className="form-control input-lg"
                          />
                  </div>

              </div>
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
              <label htmlFor="zip_code" >If you would like us to find local libraries or bookstores, please enter a zip code(optional):</label>
              <input type="text" 
                    name="zip_code" 
                    // value = {zipcode}
                    onChange={e => setZipcode(e.target.value)}
                    placeholder="your zip code"  
                    pattern="^\s*?\d{5}(?:[-\s]\d{4})?\s*?$" />
    
            </div>
            <p></p>
            <button className="btn btn-lg btn-info btn-block">Register
            </button>
          </div>
      </form>
      
    )
  }


// -------------LOGOUT IN FUNCTIONS AND ROUTES ----------------//

function Logout(props) { 
    let history = useHistory();
    const {loggedIn, setLoggedIn} = React.useContext(LoginComplete);

    console.log("IN LOGOUT")
    const handleSubmit = (event) => {
  
      const logout_user = {"logout": true}
  
      fetch('/logout')
      .then(response => response.json())
      .then(data => {
       
          alert(`${data.status}`);
        
        })
      console.log( "LOGGING OUT", logout_user)
      setLoggedIn(false);
   
      }
      console.log("LOGGEDOUT", loggedIn)
      history.push('/');
    // a form 
    return (
        
                <form className="form-signout" onSubmit={handleSubmit}>
  
                <h2 className="form-signout-heading">Logout</h2>
  
                <button className="btn btn-outline-secondary">Log out</button>
  
                </form>
        
    )
  }
  

  function Login(props) { 
    let history = useHistory();
    const [email, setEmail] = React.useState();
    const [password, setPassword] = React.useState();
    const {loggedIn, setLoggedIn} = React.useContext(LoginComplete);

  
  
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
          if (data.status.startsWith('ok')) {
            setLoggedIn(true);  
            console.log("WHAT IS THIS PROPS", loggedIn, log);
            history.push('/')
       
          }
          
          else {
              history.push('/')
          }

        }
      )
  
      
      console.log("LOGIN USER", login_user);
      event.preventDefault();
      history.push('/')
      console.log(loggedIn, "ANOTHER LOGIN CHECK")
      
      }
      
    // a form 
    return (
      <React.Fragment>
     
        <form className="form-signin" onSubmit={handleSubmit}>
          
            <h2 className="form-signin-heading">Please Sign In</h2>
    
            <div className="form-group">
              <label htmlFor="email-field" >Email Address</label>
              <input type="email"
                    name="email"
                    className="form-control input-lg"
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    autoFocus />
            </div>
    
            <div className="form-group">
              <label htmlFor="password-field" >Password</label>
              <input type="password"
                    name="password"
                    className="form-control input-lg"
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required />
            </div>
            
            <button className="btn btn-lg btn-info btn-block">Sign In
            </button>
    
          </form>
        </React.Fragment>
    )
  }
