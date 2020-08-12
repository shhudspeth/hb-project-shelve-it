from flask_sqlalchemy import SQLAlchemy
import flask
from sqlachemy_utils import PasswordType, force_auto_coercion

# Instantiate a SQLAlchemy object. We need this to create our db.Model classes.
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

# Table users {
#   user_id int [pk, increment] // auto-increment
#   email varchar
#   password varchar
#   profile_link varchar
#   text_number int
#   contact_by_email boolean
#   contact_by_phone boolean
#   local_library int [ref: > libraries.library_id]
#   local_bookstore int [ref: > indieBookstores.bookstore_id]
# }


class User(db.Model):
    """ data model for a user """

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

    bookcase = db.relationship('Bookcase')

    def __repr__(self):
            """Return a human-readable representation of a User."""
            return f"<User id ={self.user_id} name ={self.user_name} email = {self.email}>"


# Table book {
#  book_id int [pk, increment] // auto-increment
#   isbn int
#   title varchar
#   author varchar
#   publisher varchar
#   year_published int
#   img_source varchar
#   description varchar
#   genre_book_id int [ref: > genre.genre_id]
#   spine_image_source varchar
#   color_palate_id int [ref: > color_schemes.color_palate_id]
# }


class Book(db.Model):
    """ Data Model for a Book """ 

    __tablename__ = "books"
    
    # Definition of Columns and relationships
    book_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    isbn = db.Column(db.String(30), unique=True)
    title = db.Column(db.String(30), nullable=False, unique=True)
    author= db.Column(db.String(30), nullable=False)
    publisher= db.Column(db.String(30) )
    img_source = db.Column(db.String(100))
    description = db.Column(db.String(100))
    year_published = db.Column(db.Integer)
    want_to_read  = db.Column(db.Boolean)
    have_already_read = db.Column(db.Boolean)
    ordered = db.Column(db.Boolean)
    liked = db.Column(db.Boolean)
    didnot_like = db.Column(db.Boolean)
    removed_from_shelf boolean = db.Column(db.Boolean)

     bookshelves = db.relationship('Bookshelf')
  
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"<Book id ={self.book_id} title ={self.title} author = {self.author}>"



# Table bookshelf {
 
#   shelf_id int [pk, increment] // auto-increment
#   book_id int [ref: < book.book_id]
#   sent_to_user boolean
#   
#  
#   public_display boolean
  
# }

class Bookshelf(db.Model):
    """ Data Model for a Bookshelf """ 

    __tablename__ = "bookshelves"
    
    # Definition of Columns and relationships
    shelf_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    book_id = db.Column(db.Integer, db.ForeignKey('books.book_id'))
    nickname = db.Column(db.String(30), nullable=False)
    sent_to_user = db.Column(db.Boolean)
   

    books = db.relationship('Book')
  
    def __repr__(self):
            """Return a human-readable representation of a Bookshelf."""
            return f"<Bookshelf id ={self.book_id} name ={self.nickname} sent = {self.sent_to_user}>"

    
# Table bookcase {
#   bookcase_id int [pk, increment] //auto-increment
#   shelf_id int [ref: < bookshelf.shelf_id]
#    user_id int [ ref: > users.user_id]
#    share_link varchar
#    public_display boolean
# }

class Bookcase(db.Model):
    """ Data Model for a Bookcase (a collection of shelves) """ 

    __tablename__ = "bookcases"
    
    # Definition of Columns and relationships
    bookcase_id = db.Column(db.Integer, primary_key=True, nullable=False, autoincrement=True)
    shelf_id = db.Column(db.Integer, db.ForeignKey('bookshelves.shelf_id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'))
    nickname = db.Column(db.String(30))
    share_link = db.Column(db.String(100))
    public_display = db.Column(db.Boolean)
   
    bookshelves = db.relationship('Bookshelf')

    user = db.relationship('User')
  
    def __repr__(self):
            """Return a human-readable representation of a Book."""
            return f"<Bookcase_id ={self.book_id} name ={self.user.user_name} bookshelves = {self.bookselves}>"

    