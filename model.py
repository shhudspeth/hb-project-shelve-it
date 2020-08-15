from flask_sqlalchemy import SQLAlchemy
import flask
from sqlalchemy_utils import PasswordType, force_auto_coercion
import os
import json
from random import choice, randint  

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
    share_link = db.Column(db.String(100))
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
    title = db.Column(db.String(50), nullable=False, unique=True)
    author= db.Column(db.String(30), nullable=False)
    publisher= db.Column(db.String(50) )
    year_published = db.Column(db.String(30))
    cover_img_source = db.Column(db.String(200))
    description = db.Column(db.String())
    spine_img_source = db.Column(db.String(200))
    
    # back references to other models/FK
    shelvedbooks = db.relationship('ShelvedBook')

    bookshelves = db.relationship('Bookshelf', secondary='shelved_books')
  
    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"<Book id ={self.book_id}. The title is {self.title} and the author is {self.author}>"



# Table bookshelf (links shelved books aka books ona shelf to a user)
class Bookshelf(db.Model):
    """ Data Model for a Bookshelf """ 

    __tablename__ = "bookshelves"
    
    # Definition of Columns and relationships
    shelf_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    nickname = db.Column(db.String(50), nullable=False)
    sent_to_user = db.Column(db.Boolean)
    public_display = db.Column(db.Boolean)
   
   # back references to other models/FK
    user = db.relationship('User', foreign_keys=[user_id])
    shelvedbooks = db.relationship('ShelvedBook')

    # BOOKSHELF TO BOOK

    books = db.relationship('Book',secondary='shelved_books')
  
    #REPR
    def __repr__(self):
            """Return a human-readable representation of a Bookshelf."""
            return f"<Bookshelf_id = {self.shelf_id} the name of the Bookshelf is {self.nickname} SentBookList = {self.sent_to_user}>"

    

class ReadingStatus(db.Model):
    """ Data Model for a book that is on a shelf """ 

    __tablename__ = "reading_status"
    
    # Definition of Columns and relationships
    reading_status_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    reading_status_name = db.Column(db.String(30), unique=True)

    shelvedbook = db.relationship('ShelvedBook')
    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"< Reading_status = '{self.reading_status_name}' >"

class OwnedStatus(db.Model):
    """ Data Model for a book that is on a shelf """ 

    __tablename__ = "owned_status"
    
    # Definition of Columns and relationships
    owned_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    owned_text = db.Column(db.String(30), unique=True)

    shelvedbook = db.relationship('ShelvedBook')

    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"< Owned_status = '{self.owned_text}' >"


# Table shelvedBook (book<>BookShelf) many to many table to like books to a shelf to a user
class ShelvedBook(db.Model):
    """ Data Model for a book that is on a shelf """ 

    __tablename__ = "shelved_books"
    
    # Definition of Columns and relationships
    bookshelfbook_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    shelf_id = db.Column(db.Integer, db.ForeignKey('bookshelves.shelf_id'))
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'))
    reading_status = db.Column(db.Integer, db.ForeignKey('reading_status.reading_status_id'))
    owned_status = db.Column(db.Integer, db.ForeignKey('owned_status.owned_id'))
    
   # back references to other models/FK (SINGLE INSTANCES)
    bookshelf = db.relationship('Bookshelf', foreign_keys=[shelf_id])
    book = db.relationship('Book', foreign_keys=[book_id])
    # reading_statuses = db.relationship('ReadingStatus', foreign_keys=[reading_status])
    # owned_statuses = db.relationship('OwnedStatus', foreign_keys=[owned_status])
  
    user = db.relationship('User', secondary='bookshelves')
    # REPR
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            # TODO figure out later how to add name = '{self..user_id.user_nbookshelvesame}'
            return f"<shelvedBook_id = {self.bookshelfbook_id}  bookshelves = '{self.shelf_id}'>"



    # nickname = db.Column(db.String(30))
    # share_link = db.Column(db.String(100))
    # public_display = db.Column(db.Boolean)
    # want_to_read  = db.Column(db.Boolean)
    # have_already_read = db.Column(db.Boolean)
    # ordered = db.Column(db.Boolean)
    # liked = db.Column(db.Boolean)
    # didnot_like = db.Column(db.Boolean)
    # removed_from_shelf boolean = db.Column(db.Boolean)

def connect_to_db(flask_app, db_uri='postgresql:///shelve_it', echo=True):
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
    flask_app.config['SQLALCHEMY_ECHO'] = echo
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.app = flask_app
    db.init_app(flask_app)

    print('Connected to the db!')


if __name__ == '__main__':
    from server import app
   

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.
    connect_to_db(app)