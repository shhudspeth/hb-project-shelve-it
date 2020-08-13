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


def create_book(title, author, publisher, year_published, isbn, description):
    """ Create and return a new book"""
    book = Book(title=title, 
                  author=author, 
                  publisher=publisher, 
                  year_published=year_published, 
                  isbn=isbn, 
                  description=description)
    
    db.session.add(book)
    db.session.commit()

    return book


def return_all_books():
    """ Create and return a list of all books"""
    return Book.query.all()  


def get_book_by_id(title):
    """Return a book by title"""
    return Book.query.filter(Book.title==title).first()


# CREATE A BOOKSHELF FOR A USER
def create_user_bookshelf(shelvedbooks_id, user, nickname, year_published):
    """ Create and return a new user bookshelf"""
    user_bookshelf = Bookshelf(shelvedbooks_id=shelvedbooks_id, 
                  user=user, 
                  nickname=nickname, 
                  year_published=year_published, 
                  sent_to_user=False, 
                  public_display=False)
    
    db.session.add(user_bookshelf)
    db.session.commit()

    return user_bookshelf


# CRUD FOR A BOOKforaBOOKSELF

def create_shelvedbook(shelf, book):
    """ Create and return a new shelvedbook (book for a shelf with lots of user preferences"""
    
    shelved_book = ShelvedBook(shelf=shelf, book=book)

    
    db.session.add(shelved_book)
    db.session.commit()

    return shelved_book


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
