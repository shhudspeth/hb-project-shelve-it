import crud
from model import db, User, Book, connect_to_db, Bookshelf, ShelvedBook, OwnedStatus, ReadingStatus
from datetime import datetime
import json
import unittest
from unittest import TestCase
from flask import session
from server import app
import os

def make_book_info(num):
    with open('data/seeding_jsons/better_book_data.json') as f:
        book_data = json.loads(f.read())

    book_data_seeding = []
  
    count = 0
    for item in book_data:
            title = book_data[item]['title']
            author = book_data[item]['author']
            publisher = book_data[item]['publisher']
            published_date = book_data[item]['year_published']
            isbn = book_data[item]['isbn']
            description = book_data[item]['description']
            cover_img_source = book_data[item]['cover_img_source']['thumbnail']
            book = crud.create_book(title, author, publisher, published_date, isbn, description, cover_img_source)
            book_data_seeding.append(book)
            count += 1
            if count == num:
                continue
    return book_data_seeding
        

def get_reading_status_list():
    reading_data_seeding = []
    with open('data/seeding_jsons/reading_status.json') as f:
        reading_data = json.loads(f.read())

    for status in reading_data:
        new_status = crud.create_reading_status(status['reading_status'])
        reading_data_seeding.append(new_status)

    return reading_data_seeding

def get_owned_status_list():
    owned_data_seeding = []
    with open('data/seeding_jsons/owned_status.json') as f:
        owned_data = json.loads(f.read())

    for status in owned_data:
        new_owned = crud.create_owned_status(status['owned_status'])
        owned_data_seeding.append(new_owned)
    return owned_data_seeding


def example_data():
    """Create some sample data."""

    # In case this is run more than once, empty out existing data
    User.query.delete()
    Book.query.delete()
    Bookshelf.query.delete()
    ShelvedBook.query.delete()
    ReadingStatus.query.delete()
    OwnedStatus.query.delete()

    # Add sample users, books, bookshelves, shelvebooks, statuses
    u1 = crud.create_user('email1@email.com', 'password', 'user_name1')
    u2 = crud.create_user('email@2email.com', 'password', 'user_name2')
    u3 = crud.create_user('email3@email.com', 'password', 'user_name3')

    db.session.add_all([u1, u2, u3])

    book_data = make_book_info(12)
    book1 = book_data[10]
    book2 = book_data[9]
    book3 = book_data[0]
    book4 = book_data[1]
    book5 = book_data[2]
    book6 = book_data[3]
    book7 = book_data[4]
    book8 = book_data[5]
    book9 = book_data[6]
    book10 = book_data[7]
    book11 = book_data[8]

    db.session.add_all([book1, book2, book3, book4, book5, book6, book7, book8, book9, book10, book11])

    bookshelf_u1_1 = crud.create_user_bookshelf( u1, "u1bookshelf1")
    bookshelf_u1_2 = crud.create_user_bookshelf( u1, "u1bookshelf2")
    bookshelf_u2_1 = crud.create_user_bookshelf( u2, "u2bookshelf1")
    bookshelf_u2_2 = crud.create_user_bookshelf( u2, "u2bookshelf2")
    bookshelf_u2_3 = crud.create_user_bookshelf( u2, "u2bookshelf3")
    bookshelf_u3_1 = crud.create_user_bookshelf( u3, "u3bookshelf1")

    db.session.add_all([bookshelf_u1_1, bookshelf_u1_2, bookshelf_u2_1, bookshelf_u2_2, bookshelf_u2_3,bookshelf_u3_1 ])

    reading_status_list = get_reading_status_list()
    owned_status_list = get_owned_status_list()

    shelvedb1_u1 = crud.create_shelvedbook(bookshelf_u1_1.shelf_id, book1.book_id, 1, 2)
    shelvedb2_u1 = crud.create_shelvedbook(bookshelf_u1_1.shelf_id, book2.book_id, 2, 3)
    shelvedb3_u1 = crud.create_shelvedbook(bookshelf_u1_1.shelf_id, book3.book_id, 3, 4)
    shelvedb4_u1 = crud.create_shelvedbook(bookshelf_u1_2.shelf_id, book4.book_id, 2, 2)
    shelvedb5_u1 = crud.create_shelvedbook(bookshelf_u1_2.shelf_id, book5.book_id, 3, 3)
    shelvedb6_u1 = crud.create_shelvedbook(bookshelf_u1_2.shelf_id, book6.book_id, 4, 4)

    shelvedb1_u2 = crud.create_shelvedbook(bookshelf_u2_1.shelf_id, book7.book_id, 1, 2)
    shelvedb2_u2 = crud.create_shelvedbook(bookshelf_u2_1.shelf_id, book8.book_id, 2, 3)
    shelvedb3_u2 = crud.create_shelvedbook(bookshelf_u2_2.shelf_id, book9.book_id, 3, 4)
    shelvedb4_u2 = crud.create_shelvedbook(bookshelf_u2_2.shelf_id, book10.book_id, 2, 2)
    shelvedb5_u2 = crud.create_shelvedbook(bookshelf_u2_3.shelf_id, book11.book_id, 3, 3)
    shelvedb6_u2 = crud.create_shelvedbook(bookshelf_u2_3.shelf_id, book1.book_id, 4, 4)

    shelvedb1_u3 = crud.create_shelvedbook(bookshelf_u3_1.shelf_id, book2.book_id, 1, 2)
    shelvedb2_u3 = crud.create_shelvedbook(bookshelf_u3_1.shelf_id, book3.book_id, 2, 3)
    shelvedb3_u3 = crud.create_shelvedbook(bookshelf_u3_1.shelf_id, book1.book_id, 3, 4)
    shelvedb4_u3 = crud.create_shelvedbook(bookshelf_u3_1.shelf_id, book4.book_id, 2, 2)
    shelvedb5_u3 = crud.create_shelvedbook(bookshelf_u3_1.shelf_id, book5.book_id, 3, 3)
    shelvedb6_u3 = crud.create_shelvedbook(bookshelf_u3_1.shelf_id, book6.book_id, 4, 4)

    shelved_books_list = [shelvedb1_u1, shelvedb2_u1, shelvedb3_u1, shelvedb4_u1, 
                         shelvedb5_u1, shelvedb6_u1, shelvedb1_u2, shelvedb2_u2, 
                         shelvedb3_u2, shelvedb4_u2, shelvedb5_u2, shelvedb6_u2,
                         shelvedb1_u3, shelvedb2_u3, shelvedb3_u3, shelvedb4_u3, 
                         shelvedb5_u3, shelvedb6_u1]

    db.session.add_all(shelved_books_list)
    db.session.commit()

# TESTS TO WRITE
# CREATE USER, REPEAT USER, 

class TestCrud(unittest.TestCase):
    def setUp(self):
            """Stuff to do before every test."""

            # Get the Flask test client
            self.client = app.test_client()
            app.config['TESTING'] = True

            # Connect to test database
            connect_to_db(app, "postgresql:///testdb")

            # Create tables and add sample data
            db.create_all()
            example_data()


    def tearDown(self):
            # We don't need to do anything here; we could just
            # not define this method at all, but we have a stub
        # here as an example.
        # print("(tearDown ran)")

        db.session.remove()
        db.drop_all()
        db.engine.dispose()
        return


    def test_create_user(self):
        test_email = 'testemail@email.com'
        test_password = "test"
        test_username = "test_username"
        result = crud.create_user(test_email,test_password ,test_username )
        self.assertIn(result, User.query.all())

    # def test_create_user_already_inDB(self):
    #     test_email = 'testemail@email.com'
    #     test_password = "test"
    #     test_username = "test_username"
    #     result = crud.create_user(test_email,test_password ,test_username )
    #     result = crud.create_user(test_email,test_password ,test_username )
       
    #     self.assertRaises(result, "duplicate key value violates unique constraint")

    def test_get_user_by_id(self):
        result= crud.get_user_by_id(1)
        self.assertEqual(result.user_name, 'user_name1')

    def test_get_user_by_email(self):
        result= crud.get_user_by_email('email@2email.com')
        self.assertEqual(result.user_name, 'user_name2')

    def test_get_user_by_username(self):
        result= crud.get_user_by_username('user_name2')
        self.assertEqual(result.email, 'email@2email.com')

    # def test_index(self):
    #     result = self.client.get('/')
    #     self.assertIn(b'<h1>Color Form</h1>', result.data)

    # def test_favorite_color_form(self):
    #     result = self.client.post('/fav-color', data={'color': 'blue'})
    #     self.assertIn(b'Woah! I like blue, too', result.data)


# class FlaskTests(TestCase)

#    shelf_st = crud.get_shelvedbook(current_user.user_id, book.book_id)
#         own_st = crud.get_owned_status(shelf_st.owned_status)
#         reading_st = crud.get_reading_status(shelf_st.reading_status)
#         print("TRYING TO GET SHELF NAME", book, book.book_id, shelf_st, shelf_st.bookshelf.nickname, shelf_st.owned_status, shelf_st.reading_status)
#         print(reading_st, own_st)



if __name__ == '__main__':
    
    os.system('dropdb testdb')
    os.system('createdb testdb')
    unittest.main()