const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { Modal } = ReactBootstrap;
// import * as SendGrid from "@sendgrid/mail";


//--------------------- TWILIO EMAIL COMPONENT (DEFUNCT)  --------------------// 

// function SendAnEmail() {
//     // using Twilio SendGrid's v3 Node.js Library
//     // https://github.com/sendgrid/sendgrid-nodejs
//     const sendEmail = (event) => {
//         console.log("SEND EMAIL BUTTON TEST")

//         const sgMail = SendGrid;
//         sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//         const msg = {
//             to: 'test@example.com',
//             from: 'test@example.com',
//             subject: 'Sending with Twilio SendGrid is Fun',
//             text: 'and easy to do anywhere, even with Node.js',
//             html: '<strong>and easy to do anywhere, even with Node.js</strong>',
//         };
//         sgMail.send(msg);
//         event.preventDefault();
//     }

//     return (<button onClick={sendEmail}> Send an Email</button>)


// }


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
                                <option key={index} value={name} onChange={e => props.handleChange(e.target.value)}>{name}</option>)}
                        </select>
                </div>
            </div>
    )
    }

//--------------------- READING STATUS MENU --------------------// 

function ReadingStatusMenu(props){
    const [readingS, setReadingS] = React.useState()
   
    
    props.handleReading(readingS)

    console.log(readingS, "IN Reading MENU CHANGING STATUS")
    return (
            <React.Fragment>
            <label htmlFor="reading-menu" className="dropbtn">Reading Status</label>
                <select name="reading-menu" onChange={e => setReadingS(e.target.value)} className="dropdown-content">
                    {props.reading.map((status, index) =>
                        <option key={index} value={status}>{status}</option>)}
                </select>
                </React.Fragment>
      
)
}
//---------------------OWNED STATUS MENU--------------------//

function BookStatusMenu(props){
    const [ownedS, setOwnedS] = React.useState();
    
    props.handleOwned(ownedS)
    console.log(ownedS, "IN OWNED MENU CHANGING STATUS")

    return (
        <React.Fragment>
            <label htmlFor="book-menu" className="dropbtn">Book Status</label>
                <select name="book-menu" onChange={e => setOwnedS(e.target.value)} className="dropdown-content">
                    {props.owned.map((name, index) =>
                        <option value={name} key={index}>{name}</option>)}
                </select>
        </React.Fragment>
)
}

//---------------------BOOKTABLE FOR BOOKSHELF TABLE--------------------//
function BookTable(props){
    const rows=[];
    
    props.books.forEach((book, idx) => {
        rows.push(<BookRow book={book} key={idx} />)

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
    console.log("what are the book props", props.bookTabs);
    // const [shelfSelect, setShelfSelect] = React.useState();
    

    // setShelfSelect(props.shelf);
    // console.log(shelfSelect);
    // function handleShelfSelect(newValue) {
    //     setShelfSelect(newValue);
    //   }


    return (

        <div>
            {/* <SendAnEmail /> */}
            {/* <h4>Search Bar and Sort Methods</h4>
            <ReadingStatusMenu reading={props.reading}  />
            <ShelvesListMenu key={1} shelves={props.shelves} handleShelvesSelect={() =>props.handleShelvesSelect} /> */}
            {/* <SearchBar reading={props.reading} owned={props.owned} /> */}
            <h2>Books on Your Shelf</h2>
            <BookTable books={props.bookTabs} />
        </div>
            
            )
    
}



  
//---------------------HOMEPAGE--------------------//

function Homepage(props) {
    
    // Sets some state Variables and props variables
    const [allShelves, setAllShelves] = React.useState(true);
    const [showSpecificShelf, setShowSpecificShelf] = React.useState(false);
    const [displayShelf, setDisplayShelf] = React.useState("");
    const [textShelf, setTextShelf] = React.useState("");
    const [popupEmailModal, setPopupEmailModal] = React.useState(false)


    function handleAllShelves(newValue) {
        setAllShelves(newValue)
    }

    function handleTextShelf(newValue) {
        setTextShelf(newValue)
        setPopupEmailModal(true)
        console.log("IS MODAL WORKING", popupEmailModal, textShelf)
    }
   
    function handleDisplayShelfname(newValue){
        setDisplayShelf(newValue)
        setAllShelves(false)
        setShowSpecificShelf(true)
    }

        
        const sendBookEmail = (event) => {
                 
        console.log("SET TEXT SHELF", "SHELF TO BE PASSED", props.textShelf)

            const text = {"email": email, "message": message, "shelf": props.textShelf}
            
            
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

    
    console.log(props.loggedIn, "checking rendering value")
    console.log(displayShelf, showSpecificShelf, allShelves, "TRYING TO MAKE SURE VLAUES CHANGE DISPLAYSHELF")
    
    return (
    <div>
        
            {!props.loggedIn && <Login loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
            {!props.loggedIn && <Register loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
            <div className="btn-group" role="group" aria-label="Button group with nested dropdown">
                <button type="button" className="btn btn-secondary">Upload Books Via Photo</button>
                <button type="button" className="btn btn-secondary">Add a Book</button>

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
                        Email books from Selected Shelf
                    </button>
                    <div className="dropdown-menu" aria-labelledby="btnGroupDrop1">
                        <a className="dropdown-item" data-toggle="modal" data-target="#shelf-modal" onClick={()=> handleTextShelf("all")}>All Shelves</a>
                            {props.shelves.map((name, index) =>
                                 <a className="dropdown-item" key={index} data-toggle="modal" data-target="#shelf-modal" onClick= {()=> handleTextShelf(name)}>{name}</a>)}
                    </div>
                    <div className="modal fade" id="shelf-modal" tabIndex="-1" role="dialog" aria-labelledby="shelf-modal1-label" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="SendEmailModal">Send an Email With the following Books</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                </div>
                                <div className="modal-body">
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="recipient-name" className="col-form-label">Email:</label>
                                                <input type="text" className="form-control" name="email" id="recipient-email" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message-text" className="col-form-label">Message:</label>
                                                <textarea className="form-control" message="message" id="message-text"></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="submit" className="btn btn-primary" onClick={sendBookEmail}> Send email</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            
                <button type="button" className="btn btn-secondary">Log out</button>

            </div>
            <h1>Welcome to Shelve-It</h1>
            <h3> a place to keep track of your reading needs </h3>
            <p></p>
            <div className="container">
                <div className="row justify-content-md-center">
                    <UploadAPhoto shelves={props.shelves}reading={props.reading} owned={props.owned}  />
                    <AddaBook reading={props.reading} owned={props.owned} shelves={props.shelves} />
                </div>
            </div>
            <p></p>
            {/* && <SendBooklistEmail textShelf={textShelf} /> */}
            {popupEmailModal}

            {!allShelves && <DisplayShelf reading={props.reading} owned={props.owned} 
                                        shelves={props.shelves} shelf={displayShelf}/> }
            {allShelves && <FilterableBookshelfTable books={props.books} bookTabs={props.bookTabs} 
                                        reading={props.reading} owned={props.owned} 
                                        shelves={props.shelves}/> }
            {props.loggedIn && <Logout loggedIn={props.loggedIn} handleLogin={() =>props.handleLogin} /> }
         
      
    </div>)
  }

// MAIN ROUTER AND SWITCH APP

function App(props) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    let cookieValue = document.cookie
    console.log("COOKIE", cookieValue);

    
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
        
        }, ["loading"]);
        
  
   
    return (
        <Router>
            <div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/"> Home </Link>
                        </li>
                        <li> 
                            <Link to="/bookshelf/"> Your Bookshelf </Link>
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
                        <UploadAPhoto shelves={shelvesList} reading={reading_stats} owned={owned_stats} />
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
