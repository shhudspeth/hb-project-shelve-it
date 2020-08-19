from model import db, User, Book, connect_to_db, Bookshelf, ShelvedBook, OwnedStatus, ReadingStatus
from datetime import datetime



# CRUD FUNCTIONS for USER CLASS

def create_user(email, password, user_name):
    """Create and return a new user."""
    joined_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user = User(email=email, password=password, user_name=user_name, joined_at = joined_at)

    db.session.add(user)
    db.session.commit()

    return user


def create_user_register(email, password, user_name, text_number, communication, contact, zipcode):
    """Create and return a new user via registration form."""

    # TODO 
    # 1. make a zipcode function
    # 2. make a text_number function
    # 3. make a public or private display feature
    joined_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user = User(email=email, password=password, user_name=user_name, joined_at = joined_at, text_number=text_number)

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
    return Book.query.all()  


def get_book_by_name(title):
    """Return a book by title"""
    return db.session.query(Book).filter(Book.title==title).first()

def get_book_by_id(book_id):
    """Return a book by id"""
    return db.session.query(Book).filter(Book.book_id==book_id).first()


# CREATE A BOOKSHELF FOR A USER
def create_user_bookshelf( user, nickname):
    """ Create and return a new user bookshelf"""
    user_bookshelf = Bookshelf(user_id=user.user_id, 
                  nickname=nickname, 
                  sent_to_user=False, 
                  public_display=False)
    
    db.session.add(user_bookshelf)
    db.session.commit()

    return user_bookshelf

# QUERIES ON BOOKSHELF

def return_all_books_on_shelf_by_user(user_id):
    """ Return a list of all books on a user shelf by user id"""
    user_books = db.session.query(Bookshelf).filter(Bookshelf.user_id==user_id).all()

    all_user_books = [shelf.books for shelf in user_books ]
    
    return(all_user_books)


def return_books_on_shelf_by_shelfid(shelf_id, user_id):
    """ Return a list of all books on a user shelf by user id"""
    id_shelf_books = Bookshelf.query.filter((Bookshelf.shelf_id==shelf_id) & (Bookshelf.user_id==user_id)).first()
    return(id_shelf_books.books)



# CRUD FOR A BOOKforaBOOKSELFpsql

def create_shelvedbook(shelf, book, reading_status, owned_status):
    """ Create and return a new shelvedbook (book for a shelf with lots of user preferences"""
    
    shelved_book = ShelvedBook(shelf_id=shelf, 
                                book_id=book, 
                                reading_status=reading_status, 
                                owned_status=owned_status)

    
    db.session.add(shelved_book)
    db.session.commit()

    return shelved_book

def get_shelvedbook(user_id, book_id):
    """ Return a new shelvedbook (book for a shelf with lots of user preferences"""
    user_books = db.session.query(Bookshelf).filter(Bookshelf.user_id==user_id).all()
    shelved_book = ShelvedBook(shelf_id=shelf, 
                                book_id=book, 
                                reading_status=reading_status, 
                                owned_status=owned_status)

    
    db.session.add(shelved_book)
    db.session.commit()

    return shelved_book

#getshelvedbook
#.readingstatus=newstatus
#commit should save object (check if you have to add to session, )

def create_reading_status(status):
    """ Create a reading status for a given book" """

    reading_status = ReadingStatus(reading_status_name = status)

    db.session.add(reading_status)
    db.session.commit()

    return reading_status


def create_owned_status(owned_status):
    """ Create an owned status for a given book" """

    owned_status = OwnedStatus(owned_text = owned_status)
    
    db.session.add(owned_status)
    db.session.commit()

    return owned_status




if __name__ == '__main__':
    from server import app
    
    connect_to_db(app)
