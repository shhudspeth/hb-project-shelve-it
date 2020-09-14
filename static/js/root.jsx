const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { Modal } = ReactBootstrap;
const {Dropdown} =ReactBootstrap ;
const LoginComplete = React.createContext(null);


  
//---------------------HOMEPAGE--------------------//

function Homepage(props) {
    
    // Sets some state Variables and props variables
   
    const [allShelves, setAllShelves] = React.useState(true);
    const [displayShelf, setDisplayShelf] = React.useState("");
    const [textShelf, setTextShelf] = React.useState("");
    const [popupEmailModal, setPopupEmailModal] = React.useState(false);
    const [showUploadPhoto, setShowUploadPhoto] = React.useState(false);
    const [showAddaBook, setShowAddabook] = React.useState(false);
    const [showLogout, setShowLogout] = React.useState(false);
    const [loginLogoutText, setLoginLogoutText] = React.useState("Logout");
    const [modalEmail, setModalEmail] = React.useState("")
    const [modalMessage, setModalMessage] = React.useState("")
    const {loggedIn, setLoggedIn} = React.useContext(LoginComplete);
    
    // if (props.loggedIn){
    //     setLoginLogoutText("Logout");
    // }

    function handleShowLogout(newValue) {
        setShowLogout(newValue)
        if (loggedIn){
        setLoginLogoutText("Logout")
        }
        else {
        setLoginLogoutText("Login")
        }
    }
    function handleUploadPhoto(newValue) {
        setShowUploadPhoto(newValue)
    }

    function handleAllShelves(newValue) {
        setAllShelves(newValue)
    }
    function handleAddaBook(newValue) {
        setShowAddabook(newValue)
    }

    function handleTextShelf(newValue) {
        setTextShelf(newValue)
        setPopupEmailModal(true)
        console.log("IS MODAL WORKING", popupEmailModal, textShelf)
    }
   
    function handleDisplayShelfname(newValue){
        setDisplayShelf(newValue)
        setAllShelves(false)
        
    }

        
        const sendBookEmail = (event) => {
                 
        console.log("SET TEXT SHELF", "SHELF TO BE PASSED", textShelf, )

            const text = {"email": modalEmail, "message": modalMessage, "shelf": textShelf}
            
            
            fetch(`/api/make-booklist/${textShelf}`, {
                method: 'POST', 
                body: JSON.stringify(text),
                headers: {
                'Content-Type': 'application/json'
                }}
            )
            .then(response => response.json())
            .then(data => {
                alert(`Thanks, ${data.user}. Just sent you an email. ${data.status}`)
                } )
            
            
            event.preventDefault();
            setAllShelves(true);

          } 
   
    console.log(props.loggedIn, "checking rendering value")
    
    console.log(displayShelf, allShelves, "TRYING TO MAKE SURE VLAUES CHANGE DISPLAYSHELF")
    
    return (
    <div className ="container">
        <div className="logo-header">
        <img src="static/images/CurateLogo.png" className="center-logo" id="logo" alt= "Bookshelf of books" title="Shelve-It: Curate your books; Curate your reading list"></img>   
        
           {/* <Navbar loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> */}
            <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                <button type="button" onClick={()=> handleUploadPhoto(true)} className="btn btn-secondary">Upload Books</button>
                <button type="button" onClick={()=> handleAddaBook(true)} className="btn btn-secondary">Add Book</button>

                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Display Selected Shelf
                    </button>
                    <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <a className="dropdown-item" onClick={()=> handleAllShelves(true)}>All Shelves</a>
                            {props.shelves.map((name, index) =>
                                 <a className="dropdown-item" key={index} onClick={()=> handleDisplayShelfname(name)}>{name}</a>)}
                    </div>
                </div>
                <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Email Books from Selected Shelf
                    </button>
                    <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <a className="dropdown-item" href="#">All Shelves</a>
                        <a className="dropdown-item" data-toggle="modal" data-target="#shelf-modal" onClick= {e=> setTextShelf("all")}>All Shelves</a>
                            {props.shelves.map((name, index) =>
            
                                 <a className="dropdown-item" key={index} data-toggle="modal" data-target="#shelf-modal" onClick= {e=> setTextShelf(name)}>{name}</a>)}
                    </div>
                    
                {/* <div className="btn-group" role="group">
                    <button id="btnGroupDrop1" type="button" className="btn btn-secondary " data-toggle='modal' data-target="#shelf-modal" aria-haspopup="true" aria-expanded="false">
                        Email books from Selected Shelf
                    </button> */}
        
                    <div className="modal fade" id="shelf-modal" tabIndex="-1" role="dialog" aria-labelledby="shelf-modal1-label" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="SendEmailModal">Send an Email with the following Books</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="recipient-name" className="col-form-label">Email:</label>
                                                <input type="text" onChange={e => setModalEmail(e.target.value)} className="form-control" name="email" id="recipient-email" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                                                <textarea className="form-control" onChange={e => setModalMessage(e.target.value)} message="message" id="message-text"></textarea>
                                        </div>
                                        Shelf selected to send: {textShelf}
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-info" onClick={sendBookEmail} data-dismiss="modal" > Send email</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <button type="button" onClick={() => handleShowLogout(true)} className="btn btn-secondary">{loginLogoutText}</button>
            </div>
            </div>
            {/* <h1>Welcome to Shelve-It</h1>
            <h3> a place to keep track of your reading needs </h3>
            <p></p> */}
            <div className="container" id="below-logo">
                <div className="row" id= "display-components">
                    {showLogout && <Logout loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} />}
                    {showUploadPhoto &&  <UploadAPhoto shelves={props.shelves}reading={props.reading} owned={props.owned}  />}
                    {showAddaBook && <AddaBook reading={props.reading} owned={props.owned} shelves={props.shelves} handleAddaBook={() => handleAddaBook} /> }
    
                    {/* && <SendBooklistEmail textShelf={textShelf} /> */}
                    {popupEmailModal}

                    {!allShelves && <DisplayShelf reading={props.reading} owned={props.owned} 
                                        shelves={props.shelves} shelf={displayShelf}/> }
                    {allShelves && <FilterableBookshelfTable books={props.books} bookTabs={props.bookTabs} 
                                        reading={props.reading} owned={props.owned} 
                                    shelves={props.shelves}/> }

                  
           
                </div>
            </div>
      
    </div>)
  }

// MAIN ROUTER AND SWITCH APP

function App(props) {
    
    const [loggedIn, setLoggedIn] = React.useState(null);
    const [shelvesList, setShelvesList] = React.useState(['no shelves']);
    const [reading_stats, setReadingStats] = React.useState([]);
    const [owned_stats,setOwnedStats] = React.useState([]);
    const [bookTable, setBookTable] = React.useState(["loading"]);
  
    
    // Fetches books from database and displays on site

      function handleLogin(newValue) {
        setLoggedIn(newValue);
      }

    console.log("LOGGED IN", loggedIn)

    React.useEffect(() => {
        
        console.log("fetching books, shelves, reading statuses, owned statuses...")
        fetch('/api/bookshelf')
        .then(response => response.json())
        .then((data) => {
            console.log("DATA FROM SERVER, APP ISLOGGEDIN", data)
            if (data.user) {
                handleLogin(true);
                setLoggedIn(true);
                console.log(data.user, "fetched books")
            }
            
            // going to be a prop... not need to update
            const r_s =[];
            for (const stat of data.reading_st_list) {
                r_s.push(stat.reading_status)   
            };
            setReadingStats(r_s)

             // going to be a prop... not need to update
             const o_s =[];
            for (const stat of data.owned_st_list) {
                o_s.push(stat.owned_status)   
            };
            setOwnedStats(o_s)
            
             // going to be a State should be able to update
            const newshelvesList = [];
            for (const shelf of data.shelves) {
                newshelvesList.push(shelf.name)
            };
            setShelvesList(newshelvesList);
            console.log("WHAT SHELVES ARE BEING SENT", newshelvesList, shelvesList)
            
            //get book data
            const newbookTable= [];
            for (const post of data.books) {
            
                newbookTable.push(post)
                console.log("adding_books")
                };
        
            setBookTable(newbookTable);
            
        }) 
        
        
        }, [loggedIn]);
        
       
    return (
        <LoginComplete.Provider value={{loggedIn, setLoggedIn}}>
        <Router>
            <div className="navbar-header" >
                <nav className="navbar-light bg-light" id="nav">
                    <div className="row">
                     <ul>
                        <li>
                        <i className="fas fa-book"></i>
                            <Link to="/" > Home </Link>
                        </li>
                        <li> 
                            {!loggedIn && <Link to="/register"> Register </Link> }
                        </li>
                        <li>
                            {!loggedIn && <Link to="/login" > Login </Link> }
                        </li>
                        
                    </ul>
                    </div> 
                </nav>
                </div>
                
              

                <Switch>

                    <Route path="/register" >
                        <Register loggedIn={loggedIn} handleLogin={() =>handleLogin}/>
                    </Route>
                    
                    <Route path="/login">

                            <Login loggedIn={loggedIn} handleLogin={() =>handleLogin} />
                    </Route>
                   
                    <Route path="/logout">
                        <Logout loggedIn={loggedIn} handleLogin={() =>handleLogin} />
                    </Route>
            
                    <Route path="/upload-book-photo">
                        <UploadAPhoto shelves={shelvesList} reading={reading_stats} owned={owned_stats} />
                    </Route>
                    <Route path="/add-book-to-shelf">
                        <AddaBook shelves={shelvesList} reading={reading_stats} owned={owned_stats}/>
                    </Route>

                    <Route path="/bookshelf">
                        <FilterableBookshelfTable loggedIn={loggedIn} handleLogin={() =>handleLogin} bookTabs={bookTable} reading={reading_stats} owned={owned_stats} shelves={shelvesList} />
                    </Route> 
                    
                    <Route path="/book-info/:bookId">
                        <ShowBookInfo />
                    </Route>
        
                    <Route path="/">
                        
                        <Homepage loggedIn={loggedIn} handleLogin={() =>handleLogin} bookTabs={bookTable} reading={reading_stats} owned={owned_stats} shelves={shelvesList} />
                        
                    </Route>
                 </Switch>
           
        </Router>
        </LoginComplete.Provider>
        );
  
  } 
  ReactDOM.render(<App />, document.getElementById('root'))
