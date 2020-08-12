from flask_sqlalchemy import SQLAlchemy
import flask
from sqlachemy_utils import PasswordType, force_auto_coercion

# Instantiate a SQLAlchemy object to create db.Model classes.
db = SQLAlchemy()

    # force_auto_coercion()
    # password = db.Column(
    #     PasswordType(
    #         # The returned dictionary is forwarded to the CryptContext
    #         onload=lambda **kwargs: dict(
    #             schemes=flask.current_app.config['PASSWORD_SCHEMES'],
    #             **kwargs
    #         ),
    #     ),
    #     unique=False,
    #     nullable=False,
##############################################################################
# PART 1: COMPOSE ORM

# Table users 
class User(db.Model):
    """ Data model for a user """

    __tablename__ = "users"
    
    # Definition of Columns and relationships
    user_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_name = db.Column(db.String(30))
    email = db.Column(db.String(30), nullable=False, unique=True)
    password = db.Column(db.String(30), nullable=False)
    joined_at = db.Column(db.DateTime)
    profile_link = db.Column(db.String(100))
    text_number = db.Column(db.String(100))
    contact_by_email = db.Column(db.Boolean)
    contact_by_text = db.Column(db.Boolean)
    share_link = db.Column(varchar(100))
    lat = db.Column(db.Float)
    long = db.Column(db.Float)

    # back references to other models/FK
    bookshelves = db.relationship('Bookshelf')

    # REPR
    def __repr__(self):
            """Return a human-readable representation of a User."""
            return f"<User id ={self.user_id} name ={self.user_name} email = {self.email}>"


# Table book {
class Book(db.Model):
    """ Data Model for a Book """ 

    __tablename__ = "books"
    
    # Definition of Columns and relationships
    book_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    isbn = db.Column(db.String(30), unique=True)
    title = db.Column(db.String(30), nullable=False, unique=True)
    author= db.Column(db.String(30), nullable=False)
    publisher= db.Column(db.String(30) )
    year_published = db.Column(db.Integer)
    cover_img_source = db.Column(db.String(100))
    description = db.Column(db.String(100))
    spine_img_source = db.Column(db.String(100))
    
    # back references to other models/FK
    bookshelves = db.relationship('shelvedBook')
  
    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"<Book id ={self.book_id} title ={self.title} author = {self.author}>"



# Table bookshelf 
class Bookshelf(db.Model):
    """ Data Model for a Bookshelf """ 

    __tablename__ = "bookshelves"
    
    # Definition of Columns and relationships
    shelf_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    nickname = db.Column(db.String(30), nullable=False)
    sent_to_user = db.Column(db.Boolean)
    public_display = db.Column(db.Boolean)
   
   # back references to other models/FK
    users = db.relationship('User')
    books = db.relationship('Book')
  
    #REPR
    def __repr__(self):
            """Return a human-readable representation of a Bookshelf."""
            return f"<Bookshelf_id ={self.book_id} name ={self.nickname} sent = {self.sent_to_user}>"

    
# Table shelvedBook (book<>BookShelf)
class shelvedBook(db.Model):
    """ Data Model for a book that is on a shelf """ 

    __tablename__ = "shelved_books"
    
    # Definition of Columns and relationships
    bookshelfBook_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    shelf_id = db.Column(db.Integer, db.ForeignKey('bookshelves.shelf_id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'))
    
   # back references to other models/FK
    bookshelves = db.relationship('Bookshelf')
    books = db.relationship('Book')
  
    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"<shelvedBook_id ={self.bookshelfBook_id} name ={self.user.user_name} bookshelves = {self.shelf_id}>"


class reading_status(db.Model):
    """ Data Model for a book that is on a shelf """ 

    __tablename__ = "reading_status"
    
    # Definition of Columns and relationships
    reading_status_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    reading_status_name = db.Column(db.String(30), unique=True)


    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"< Reading_status ={self.reading_status_name} >"

class owned_status(db.Model):
    """ Data Model for a book that is on a shelf """ 

    __tablename__ = "owned_status"
    
    # Definition of Columns and relationships
    owned_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    owned_text = db.Column(db.String(30), unique=True)


    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"< Owned_status ={self.owned_text} >"



    # nickname = db.Column(db.String(30))
    # share_link = db.Column(db.String(100))
    # public_display = db.Column(db.Boolean)
    # want_to_read  = db.Column(db.Boolean)
    # have_already_read = db.Column(db.Boolean)
    # ordered = db.Column(db.Boolean)
    # liked = db.Column(db.Boolean)
    # didnot_like = db.Column(db.Boolean)
    # removed_from_shelf boolean = db.Column(db.Boolean)