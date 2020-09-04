from model import db, User, Book, connect_to_db, Bookshelf, ShelvedBook, OwnedStatus, ReadingStatus, Comment
from datetime import datetime

import more_crud



# CRUD FUNCTIONS FOR COMMENTS
def create_comment(user_id, book_id, comment_text):
    created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    comment = Comment(user_id=user_id, book_id=book_id, comment_text=comment_text, date_written=created_at, like_count=0, flag=0)
    db.session.add(comment)
    db.session.commit()
    return comment

def increase_like_count(comment_id):
    # get current like count, increase by 1
    #like_count
    pass

def increase_flag_comment(comment_id):
    """ increase the number of flags for comment """

    # flag_as_inappropriate 
    pass

def get_comments_by_book_id(book_id):
    comments = db.session.query(Comment).filter(Comment.book_id==book_id).all()
    return comments

  
# CRUD FUNCTIONS for USER CLASS

def create_user(email, password, user_name):
    """Create and return a new user."""
    joined_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user = User(email=email, password=password, user_name=user_name, joined_at = joined_at)

    db.session.add(user)
    db.session.commit()

    return user

def return_user_lat_long(user_id):
    user = User.query.get(user_id)
    return((user.lat, user.long))


def create_user_register(email, password, user_name, text_number, communication, contact, zipcode):
    """Create and return a new user via registration form."""

    # TODO 
    # 1. make a zipcode function DONE
    # 2. make a text_number function
    # 3. make a public or private display feature
    latlng = more_crud.get_latln_from_zip(zipcode)

    joined_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user = User(email=email, password=password, user_name=user_name, 
                joined_at = joined_at, text_number=text_number, lat=latlng[0], long=latlng[1])
    
    db.session.add(user)
    db.session.commit()

    return user

def return_all_users():
    """ Create and return a list of all users"""
    return User.query.all()  


def get_user_by_id(user_id):
    """Return a user by id"""
    return User.query.get(user_id)

def get_user_by_email(user_email):
    """ Return a user by email"""
    
    return User.query.filter(User.email==user_email).first()

def get_user_by_username(user_name):
    """ Return a user by user_name"""
    
    return User.query.filter(User.user_name==user_name).first()


# CRUD FOR BOOK CLASS


def create_book(title, author, publisher, year_published, isbn, description, cover_img_source):
    """ Create and return a new book"""
    book = Book(title=title, 
                  author=author, 
                  publisher=publisher, 
                  year_published=year_published, 
                  isbn=isbn, 
                  description=description,
                  cover_img_source=cover_img_source)
    
    db.session.add(book)
    db.session.commit()

    return book


def return_all_books():
    """ Create and return a list of all books"""
    return db.session.query(Book).all()  


def get_book_by_name(title):
    """Return a book by title"""
    return db.session.query(Book).filter(Book.title==title).first()

def get_book_by_id(book_id):
    """Return a book by id"""
    return db.session.query(Book).filter(Book.book_id==book_id).first()


# QUERIES ON BOOKSHELF
# CREATE A BOOKSHELF FOR A USER
# TODO STANDARDIZED SENDING OBJECTS OR IDS--> SHOULD BE ALL IDS

def create_user_bookshelf(user_id, nickname):
    """ Create and return a new user bookshelf"""
    user_bookshelf = Bookshelf(user_id=user_id, 
                  nickname=nickname, 
                  sent_to_user=False, 
                  public_display=False)
    
    db.session.add(user_bookshelf)
    db.session.commit()

    return user_bookshelf

# FIX BOOKSHELVES HERE

def return_user_bookshelf_by_name(user_id, nickname):
    """ Return a shelf object by user_id and nickname"""
    shelf = db.session.query(Bookshelf).filter(Bookshelf.user_id==user_id, Bookshelf.nickname==nickname).first()
    return shelf

def return_all_shelves_by_user(user_id):
    # TODO: make into a drop menu
    """ Return a list of all books on a user shelf by user id"""
    shelves = db.session.query(Bookshelf).filter(Bookshelf.user_id==user_id).all()

    return(shelves)

def return_all_books_on_shelves_by_user(user_id):
    """ Return a list of all books on a user shelf by user id"""
    shelves = db.session.query(Bookshelf).filter(Bookshelf.user_id==user_id).all()
    all_user_books =[]
    books = [shelf.books for shelf in shelves ]
    for books_ in books:
        all_user_books += books_
    
    return(all_user_books)

# FIX 
def return_books_on_shelf_by_shelfid(shelf_id, user_id):
    """ Return a list of all books on a user shelf by user id"""
    id_shelf_books = Bookshelf.query.filter((Bookshelf.shelf_id==shelf_id) & (Bookshelf.user_id==user_id)).first()
    return(id_shelf_books.books)

def return_books_on_shelf_by_nickname(nickname, user_id):
    """ Return a list of all books on a user shelf by user id"""
    id_shelf_books = Bookshelf.query.filter((Bookshelf.nickname==nickname) & (Bookshelf.user_id==user_id)).first()
    return(id_shelf_books.books)

# CRUD FOR A BOOKforaBOOKSELFpsql

def create_shelvedbook(shelf_id, book_id, reading_status_id, owned_status_id):
    """ Create and return a new shelvedbook (book for a shelf with lots of user preferences"""
    
    shelved_book = ShelvedBook(shelf_id=shelf_id, 
                                book_id=book_id, 
                                reading_status=reading_status_id, 
                                owned_status=owned_status_id)

    
    db.session.add(shelved_book)
    db.session.commit()

    return shelved_book

def get_shelvedbook(user_id, book_id):
    """ Return a  shelvedbook (book for a shelf with lots of user preferences"""
    user_sb = User.query.get(user_id)
    shelved_book = db.session.query(ShelvedBook).filter(ShelvedBook.book_id == book_id, ShelvedBook.user.contains(user_sb)).first()

    return shelved_book

def get_reading_status_id(status_text):
    return db.session.query(ReadingStatus).filter(ReadingStatus.reading_status_name==status_text).first().reading_status_id


def update_shelvedbook_reading_st(user_id, book_id, status):
    
    shelved_book = get_shelvedbook(user_id=user_id, book_id=book_id)
    status_id = get_reading_status_id(status)
    shelved_book.reading_status = status_id
    db.session.commit()
    
    return shelved_book
#getshelvedbook
#.readingstatus=newstatus
#commit should save object (check if you have to add to session, )

# READING STATUS CRUD OPERATIONS

def create_reading_status(status):
    """ Create a reading status for a given book" """

    reading_status = ReadingStatus(reading_status_name = status)

    db.session.add(reading_status)
    db.session.commit()

    return reading_status

def return_all_types_reading():
    """ RETURNS ALL THE DIFFERENT OPTIONS FOR READING STATUS"""

    return db.session.query(ReadingStatus).all()

def get_reading_status(status_id):
    return db.session.query(ReadingStatus).filter(ReadingStatus.reading_status_id==status_id).first().reading_status_name



# OWNED STATUS CRUD OPERATIONS

def create_owned_status(owned_status):
    """ Create an owned status for a given book" """

    owned_status = OwnedStatus(owned_text = owned_status)
    db.session.add(owned_status)
    db.session.commit()

    return owned_status


def get_owned_status_id(owned_text):
    return db.session.query(OwnedStatus).filter(OwnedStatus.owned_text==owned_text).first().owned_id


def update_shelvedbook_owned_st(user_id, book_id, status):
    shelved_book = get_shelvedbook(user_id=user_id, book_id=book_id)
    status_id = get_owned_status_id(status)
    shelved_book.owned_status = status_id
    db.session.commit()
    return shelved_book


def return_all_types_owned():
    """ RETURNS ALL THE DIFFERENT OPTIONS FOR OWNED STATUS"""

    return db.session.query(OwnedStatus).all()


def get_owned_status(status_id):
    return db.session.query(OwnedStatus).filter(OwnedStatus.owned_id==status_id).first().owned_text


if __name__ == '__main__':
    from server import app
    
    connect_to_db(app, db_uri='postgresql:///shelve_it')
