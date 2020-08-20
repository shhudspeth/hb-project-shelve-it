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
        return (jsonify({'message':'somethinghappened. user might not have been made'}))



@app.route('/api/bookshelf')
def display_bookshelf():
    print(session['user']+ '\n\n\n\n')
    
    if session['user']:
        current_user = crud.get_user_by_username(session['user'])
        user_books = crud.return_all_books_on_shelf_by_user(current_user.user_id)
    else:
        flash("please login first!")
        return(jsonify({"status": "please login first"}))
    serialized_books = []
    # user_books is a list of a list!!!
    for book in user_books[0]: 
       
        image_url = 'https'+ str(book.cover_img_source)[4:]
        print(image_url)
        serialized_books.append({'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, "img":image_url})
             
    return jsonify(serialized_books)


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
    
@app.route('/book_info/<book_id>')
def display_book_info(book_id):

    if session['user']:
        current_user = crud.get_user_by_username(session['user'])
        book_info = crud.get_book_by_id(book_id)
        print("\n\n\n\n", current_user, book_info, "\n\n\n\n")
        try:
            shelved_book_info = crud.get_book_by_id(current_user.user_id, book_id)
        except:
            flash("book not on shelf, add it?")
    
    #update or create shelvedbooked info
    # create_shelvedbook(shelf, book, reading_status, owned_status)
    # TODO 1. display book image, 2. display description, 3. add buttons for all the things

                                     
    return jsonify()


@app.route('/api/bookshelf/addbook', methods=["POST"])
def get_book_info():
    if session['user']:
        current_user = crud.get_user_by_username(session['user'])
        
    
    data = request.get_json()
    print("\n\n\n", 'ADDING A NEW BOOK', data, "\n\n\n")
    print ("SESSION", session, "\n\n\n")
    new_book_google_json = api.find_google_book_data(data['title'], data['author'])
    new_book_info = api.parse_response_data_for_info(new_book_google_json)
     
    if crud.get_book_by_name(new_book_info['title']):
        book = crud.get_book_by_name(new_book_info['title'])
        print("BOOK IN DB ADDING TO SHELF IF APPROPRIATE")
        
    else:
        title = new_book_info['title']
        author = new_book_info['author']  
        publisher = new_book_info['publisher']  
        year_published = new_book_info['year_published']
        isbn =  new_book_info['isbn'] 
        description = new_book_info['description']  
        cover_img_source = new_book_info['cover_img_source']
        book = crud.create_book(title, author, publisher, year_published, isbn, description, cover_img_source)
        # shelved = crud.create_shelvedbook(current_user.bookshelvesshelf_id, book, reading_status, owned_status)
    return jsonify({'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description})
    #update or create shelvedbooked info
    # create_shelvedbook(shelf, book, reading_status, owned_status)
    # TODO 1. display book image, 2. display description, 3. add buttons for all the things

                                     


@app.route("/api/top-posts")
def get_top_posts():
    # get top posts from the DB 
    # package them up nicely into a list of dicts
    
    top_posts = [
    {"id": 93, "title": "why kiwis are the best fruit, part 9", "body": " body text for p1"},
    {"id": 783, "title": "typsetting in the 19th century", "body": " body text for p2"},
    {"id": 1383, "title": "debugging, a lifes tale", "body": " body text for p3"}
    ]
    
    return jsonify(top_posts)

@app.route("/api/post", methods=["POST"])
def post():
    
    # im expecting this kind of object as JSON in the request
    # {"post_title": "post 1", "post_body": "stuf stuf stuf"}

    data = request.get_json()
    post_title = data.post_title
    post_body = data.post_body

    # do stuff to create that post in the DB

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