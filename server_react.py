from flask import Flask, render_template, jsonify, request, session, redirect, flash
import crud
import model
import json
import api
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

app = Flask(__name__)
app.secret_key = 'to-be-determined'

@app.route("/")
def root():
    return render_template("root.html")

@app.route("/sendemail")
def send_email():
    # using SendGrid's Python Library
# https://github.com/sendgrid/sendgrid-python

    message = Mail(
        from_email='from_email@example.com',
        to_emails='to@example.com',
        subject='Sending with Twilio SendGrid is Fun',
        html_content='<strong>and easy to do anywhere, even with Python</strong>')
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(e.message)
    


@app.route("/update_status", methods=["POST"])
def update_book_statuses():
    status_dict = request.get_json()
    print("\n\n\n STATUS DICTIONARY FROM ADD A BOOK", status_dict)

    if session['user']:
        print(session['user'])
        current_user = crud.get_user_by_username(session['user'])
        
        # update book reading status
        shelved_book = crud.update_shelvedbook_reading_st(current_user.user_id, \
                            status_dict['book_id'], status_dict['reading_status'])
        # update book owned status
        shelved_book = crud.update_shelvedbook_owned_st(current_user.user_id, \
                            status_dict['book_id'], status_dict['owned_status'])
        print("IS IT SAVING TE RIGHT STATUS", shelved_book, shelved_book.reading_status, shelved_book.owned_status )
        return(jsonify({"shelved_book": shelved_book.book.title }))
    



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
            session['user'] = 'unknown'
            return (jsonify({'status': "incorrect password"}))
    else:
        session['user'] = 'needs_to_register'
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
        [session.pop(key) for key in list(session.keys())]
   
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
 
    if session['user']:
        print(session['user'])
        current_user = crud.get_user_by_username(session['user'])
        print("\n\n\n CHECK USER", current_user, current_user.user_id)
        user_books = crud.return_all_books_on_shelves_by_user(current_user.user_id)
    
        print("CHECK BOOKS", user_books, "\n\n\n")
        user_shelves = crud.return_all_shelves_by_user(current_user.user_id)
    
        reading_stats = crud.return_all_types_reading()
        owned_stats = crud.return_all_types_owned()
    
    else:
        flash("please login first!")
        return(jsonify({"status": "please login first"}))
    
    print(f"\n\n\n {current_user} \n {user_shelves} \n {reading_stats} \n {owned_stats}")
    
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
    for book in user_books: 
        #get sheleved book info : shelf id, bookid, reading and owned statuses
        #print("SHEVLEDBOOK ID",current_user, current_user.user_id, book.book_id)
        shelf_st = crud.get_shelvedbook(current_user.user_id, book.book_id)
        print("SHELF", shelf_st, shelf_st.bookshelf.nickname)
        own_st = crud.get_owned_status(shelf_st.owned_status)
        reading_st = crud.get_reading_status(shelf_st.reading_status)
        # print("TRYING TO GET SHELF NAME", book, book.book_id, shelf_st, shelf_st.bookshelf.nickname, shelf_st.owned_status, shelf_st.reading_status)
        # print(reading_st, own_st)
        if book.cover_img_source.startswith('http'):
            image_url = 'https'+ str(book.cover_img_source)[4:]

        
        
        serialized_books.append({'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, "img":image_url, 
                                'shelf_name': shelf_st.bookshelf.nickname,
                                'shelf_id':shelf_st.bookshelf.shelf_id,
                                'reading_stat':reading_st,
                                'owned_stat':own_st
                                 })
    print("WHY ARE ALL SHELVES BOOKWORMMAY", serialized_books)
    return jsonify({"user": session['user'],
                    "books": serialized_books, 
                    "shelves": serial_shelves, 
                    "reading_st_list": serialized_reading_statuses, 
                    "owned_st_list": serialized_owned_statuses })


@app.route('/api/bookshelf', methods=["POST"])
def add_to_bookshelf():

        info = request.get_json()
        print(info, "GETTING A POST RESPONSE")
        file = info['filepath'].split("\\").pop()
        shelf = info['shelfname']
        new_photos = api.localize_objects_with_crop(f"static/images/{file}")
        print(new_photos)
        book_titles = api.get_text_from_list_of_photos(new_photos)
        book_dictions = []
        for book in book_titles:
            got_book =  api.find_google_book_data_onetitle(book)
            if got_book:
                book_dictions.append(api.parse_response_data_for_info(got_book))
                print("GOOD BOOK API CALL FOR:", got_book['title'])

        # serialized = MessageToJson()
        session['response'] = book_titles
        session['file'] = file
        session['shelf'] = shelf
        # TODO: CRUD ADD BOOKS FROM RESPONSE TO DATABASE to specific shelf
        print(book_dictions, book_titles)
        # TO DO ADD TO BOOK DATABASE --> MAKE A FUNCTION!?
        return jsonify(book_dictions)
    
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
        try:
            current_user = crud.get_user_by_username(session['user'])
        except:
            current_user = crud.create_user(session['email'], session['password'], session['user'])
            print("ADDED NEW USER TO DB", current_user)
    
    data = request.get_json()
    print("\n\n\n", 'ADDING A NEW BOOK', data, "\n\n\n")
    session['shelf'] = data['shelf']
    print ("SESSION", session, "\n\n\n")
    # TODO add shelf logic to add to shelf AND REFACTOR THIS CODE
    # 1. POP UP FORM IF THE SPELLING OF BOOKS IS INCORRECT
    # reading_status--> crud.return_all_types_reading(), sr[0].reading_status_name

    # owned_status --> crud. eturn_all_types_owned() sr[0].owned_text
    new_book_google_json = api.find_google_book_data(data['title'], data['author'])
    new_book_info = api.parse_response_data_for_info(new_book_google_json)
    print("\n\n\nAUTHOR DEBUG", new_book_info['author'], "\n\n\n")
    cover_img_source = 'static/images/generic-book-cover.jpg'

    # FIND BOOKSHELF
    if crud.return_user_bookshelf_by_name(current_user.user_id, data['shelf']):
        #add a shelvedbook
        print("found shelf")
        shelf = crud.return_user_bookshelf_by_name(current_user.user_id, data['shelf'])
    # CREATE SHELF IF NECESSARY
    else:
        print("creating shelf")
        shelf = crud.create_user_bookshelf(current_user.user_id, data['shelf'])
    
    print("\n\nSHELF ", shelf, "\n\n")


    # FIND BOOK IN DATABASE
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
        #MAKE A NEW BOOK ADD TO DB
        book = crud.create_book(title, author, publisher, year_published, isbn, description, cover_img_source)
        
    # MAKE A SHELVED BOOK
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
    model.connect_to_db(app, db_uri='postgresql:///shelve_it')
    app.run(debug=True, host="0.0.0.0")


# more features TODO for BOOK DETAIL PAGE:
# 1. sort by liked books
# 2. sort by want to read books
# 3. sort by owned books
# 4. sort by reading_status


#otheridea bookstyling by cards, into book like, expansion?
# add book to shelf not logged in (add to shelflist)
# search