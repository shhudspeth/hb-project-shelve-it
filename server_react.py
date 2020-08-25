from flask import Flask, render_template, jsonify, request, session, redirect, flash
import crud
import model
import json
import api

app = Flask(__name__)
app.secret_key = 'to-be-determined'

@app.route("/")
def root():
    return render_template("root.html")


@app.route("/login", methods=["POST"])
def process_login():
    """Log user into site.

    Find the user's login credentials located in the 'request.form'
    dictionary, look up the user, and store them in the session.
    """
    user_login = request.get_json()
    
    if crud.get_user_by_email(user_login['email']):
        current_user = crud.get_user_by_email(user_login['email'])
       
        if current_user.password == user_login['password']:
            session['user'] = current_user.user_name
            flash("You've logged in successfully. Welcome to your Shelve-It account.")
            # return redirect('/bookshelf')
            return(jsonify({'status': "ok. you are logged in!"}))
        else:
            flash('Incorrect Password. Please try again')
            return (jsonify({'status': "incorrect password"}))
    else:
        flash("No account with that email exists. Please create one or try again")
        # return redirect('/register')
        return(jsonify({'status': "no user with that email"}))

@app.route("/logout")
def process_logout():
    """Log user out of site.

    Find the user's login credentials located in the 'request.form'
    dictionary, look up the user, and store them in the session.
    """
    if session['user']:
        print(session, "USER LOGGED IN")
        session.pop('user')
        print(session, "USER LOGGED OUT")
   
        flash("You've logged out successfully")
        # return redirect('/bookshelf')
        return(jsonify({'status': "ok. you are logged out. Login to see shelf!"}))
      
    else:
        flash("You are not logged in. Please log in to log out")
        # return redirect('/register')
        return(jsonify({'status': "no logout possible"}))



@app.route('/register', methods=["POST"])
def register_new_account():
    data = request.get_json()
    print(data)
    email = data['email']
    pswd = data['password']
    uname = data['username']
    phnum = data['phone_number']
    email_text = data['email_or_text']
    public = data['public_shelf']
    zipc = data['zipcode']

    new_user = crud.create_user_register(email, pswd, uname, phnum, email_text, public, zipc)

    if new_user:
        return (jsonify({'message':'ok'}))
    else:
        return (jsonify({'message':'something happened. user might not have been made'}))


@app.route('/api/bookshelf')
def display_bookshelf():
    # print(session)
    # print(session['user']+ '\n\n\n\n')
    
    if session['user']:
        print(session['user'])
        current_user = crud.get_user_by_username(session['user'])
        user_books = crud.return_all_books_on_shelf_by_user(current_user.user_id)
        user_shelves = crud.return_all_shelves_by_user(current_user.user_id)
        reading_stats = crud.return_all_types_reading()
        owned_stats = crud.return_all_types_owned()
    
    else:
        flash("please login first!")
        return(jsonify({"status": "please login first"}))
    
    # print(f"\n\n\n {current_user} \n {user_shelves} \n {reading_stats} \n {owned_stats}")
    
    serial_shelves = []
    for shelf in user_shelves:
        serial_shelves.append({'shelf_id': shelf.shelf_id, 'name': shelf.nickname})
    
    serialized_reading_statuses = []
    for stat in reading_stats:
        serialized_reading_statuses.append({'reading_status_id': stat.reading_status_id, 'reading_status': stat.reading_status_name})

    serialized_owned_statuses = []
    for stat in owned_stats:
        serialized_owned_statuses.append({'owned_id': stat.owned_id, 'owned_status': stat.owned_text})

    
    serialized_books = []
    # user_books is a list of a list!!!
    for book in user_books[0]: 
        #get sheleved book info : shelf id, bookid, reading and owned statuses
        shelf_st = crud.get_shelvedbook(current_user.user_id, book.book_id)
        # print(shelf_st.owned_statuses.owned_text)
        if book.cover_img_source.startswith('http'):
            image_url = 'https'+ str(book.cover_img_source)[4:]
        
        serialized_books.append({'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, "img":image_url, 
                                'shelf_name': shelf_st.bookshelf.nickname,
                                'reading_stat':shelf_st.reading_statuses.reading_status_name,
                                'owned_stat':shelf_st.owned_statuses.owned_text
                                 })
             
    return jsonify({"user": session['user'],
                    "books":serialized_books, 
                    "shelves": serial_shelves, 
                    "reading_st_list": serialized_reading_statuses, 
                    "owned_st_list": serialized_owned_statuses })


@app.route('/api/bookshelf', methods=["POST"])
def add_to_bookshelf():

        info = request.get_json()
        print(info, "GETTING A POST RESPONSE")
        file = info['filepath'].split("\\").pop()
        shelf = info['shelfname']
        response = api.text_from_photo(f"static/images/{file}")
        # serialized = MessageToJson()
        session['response'] = response.text_annotations[0].description
        session['file'] = file
        session['shelf'] = shelf
        # TODO: CRUD ADD BOOKS FROM RESPONSE TO DATABASE to specific shelf

        return jsonify(response.text_annotations[0].description)
    
    #books = crud.
    
@app.route('/api/book_info/<book_id>')
def display_book_info(book_id):
    #update or create shelvedbooked info
    # create_shelvedbook(shelf, book, reading_status, owned_status)
    # TODO 1. display book image, 2. display description, 3. add buttons for all the things
    # add function for users that don't have account or are not signed in to save to booklist
    
    if session['user']:
        current_user = crud.get_user_by_username(session['user'])
        book = crud.get_book_by_id(book_id)
        # print("\n\n\n\n USER", current_user.user_name, "GETTING",  book.title, "\n\n\n\n")
        # try:
        #     shelved_book_info = crud.get_book_by_id(current_user.user_id, book_id)
        # except:
     

        image_url = 'https'+ str(book.cover_img_source)[4:]
        serialized_book = {'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, "img":image_url, }
             
    return jsonify(serialized_book)



@app.route('/api/bookshelf/addbook')
def send_status():
    reading_st = crud.return_all_types_reading()
    owned_st = crud.return_all_types_owned()

    reading_stat = [x.reading_status_name for x in reading_st]
    owned_stat = [x.owned_status_name for x in owned_st]


    return jsonify({'reading_st':reading_stat, 'owned_st': owned_stat})

@app.route('/api/bookshelf/addbook', methods=["POST"])
def get_book_info():
    if session['user']:
        current_user = crud.get_user_by_username(session['user'])
        
    
    data = request.get_json()
    print("\n\n\n", 'ADDING A NEW BOOK', data, "\n\n\n")
    session['shelf'] = data['shelf']
    print ("SESSION", session, "\n\n\n")
    # TODO add shelf logic to add to shelf AND REFACTOR THIS CODE
    # reading_status--> crud.return_all_types_reading(), sr[0].reading_status_name

    # owned_status --> crud. eturn_all_types_owned() sr[0].owned_text
    new_book_google_json = api.find_google_book_data(data['title'], data['author'])
    new_book_info = api.parse_response_data_for_info(new_book_google_json)
    print("\n\n\nAUTHOR DEBUG", new_book_info['author'], "\n\n\n")
    cover_img_source = 'static/images/generic-book-cover.jpg'
    if crud.get_book_by_name(new_book_info['title']):
        book = crud.get_book_by_name(new_book_info['title'])
        print("BOOK IN DB ADDING TO SHELF IF APPROPRIATE")
        
    
    # TODO be able to handle books with mutliple authors
    else:
        title = new_book_info['title']
        author = new_book_info['author'][0]
        publisher = new_book_info['publisher']  
        year_published = new_book_info['year_published']
        isbn =  new_book_info['isbn'] 
        description = new_book_info['description']
        
        if new_book_info['cover_img_source']:
            cover_img_source = new_book_info['cover_img_source']
        
            
        print(cover_img_source)


        book = crud.create_book(title, author, publisher, year_published, isbn, description, cover_img_source)
          # MAKE A SHELVED BOOK
        if crud.return_shelf_by_user_and_name(current_user.user_id, data['shelf']):
            #add a shelvedbook
            shelf = crud.return_shelf_by_user_and_name(current_user.user_id, data['shelf'])
            shelved = crud.create_shelvedbook(shelf.shelf_id, book.book_id, 5, 4)

        else:
            shelf = crud.create_user_bookshelf( current_user, data.shelf)
            shelved = crud.create_shelvedbook(shelf.shelf_id, book.book_id, 5, 4)

        print("shelvedbook, try to refreshshelf", shelf, shelved)

    return jsonify({'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, 'img':cover_img_source})
    
    #update or create shelvedbooked info
    # create_shelvedbook(shelf, book, reading_status, owned_status)
    
    # create_book
    # return_shelf_by_user_and_name
    # create_shelvedbook
    # return_all_books_on_shelf_by_user                         


if __name__ == "__main__":
    model.connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")


# more features TODO for BOOK DETAIL PAGE:
# 1. sort by liked books
# 2. sort by want to read books
# 3. sort by owned books
# 4. sort by reading_status


#otheridea bookstyling by cards, into book like, expansion?
# add book to shelf not logged in (add to shelflist)
# search