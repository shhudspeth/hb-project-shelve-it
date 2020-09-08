const Router = ReactRouterDOM.BrowserRouter;
const Route =  ReactRouterDOM.Route;
const Link =  ReactRouterDOM.Link;
const Prompt =  ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;
const useParams = ReactRouterDOM.useParams;
const { Modal } = ReactBootstrap;



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
    const [readingS, setReadingS] = React.useState(props.reading[0])
   
    
    props.handleReading(readingS)

    console.log(readingS, "IN Reading MENU CHANGING STATUS")
    return (
            <React.Fragment>
            <label htmlFor="reading-menu" className="dropbtn">Reading Status</label>
                <select name="reading-menu" value={props.reading[0]} onChange={e => setReadingS(e.target.value)} className="dropdown-content">
                    {props.reading.map((status, index) =>
                        <option key={index} value={status}>{status}</option>)}
                </select>
                </React.Fragment>
      
)
}
//---------------------OWNED STATUS MENU--------------------//

function BookStatusMenu(props){
    const [ownedS, setOwnedS] = React.useState(props.owned[0]);
    
    props.handleOwned(ownedS)
    console.log(ownedS, "IN OWNED MENU CHANGING STATUS")

    return (
        <React.Fragment>
            <label htmlFor="book-menu" className="dropbtn">Book Status</label>
                <select name="book-menu" value={props.owned[0]} onChange={e => setOwnedS(e.target.value)} className="dropdown-content">
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
                <tbody className="bookrows">
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
                <td><Link to={`/book-info/${bookData.book_id}`}><img src={bookData.img}></img></Link></td>
                <td><Link to={`/book-info/${bookData.book_id}`} >{bookData.title}</Link></td>
                <td>{bookData.author}</td>
                <td>{bookData.publisher}</td>
                <td>{bookData.reading_stat}</td>
                <td>{bookData.owned_stat}</td>
                <td>{bookData.shelf_name}</td>
                <td><button>Edit Book</button></td>
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

