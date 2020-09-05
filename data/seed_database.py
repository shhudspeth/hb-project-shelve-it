import os
import json
from random import choice, randint
from datetime import datetime

import importlib
crud  = importlib.load_module('../crud.py')
model = importlib.load_module('../model.py')
server = importlib.load_module('../server.py')
# import crud
# import model
# import server

os.system('dropdb shelve_it')
os.system('createdb shelve_it')

model.connect_to_db(server.app,db_uri='postgresql:///shelve_it')
model.db.create_all()

# load data from json file and creates Book objects for database
with open('data/seeding_jsons/better_book_data.json') as f:
     book_data = json.loads(f.read())

book_data_seeding = []
for item in book_data:
    print(item)
    title = book_data[item]['title']
    author = book_data[item]['author']
    publisher = book_data[item]['publisher']
    published_date = book_data[item]['year_published']
    isbn = book_data[item]['isbn']
    description = book_data[item]['description']
    cover_img_source = book_data[item]['cover_img_source']['thumbnail']

    new_book = crud.create_book(title, author, publisher, published_date, isbn, description, cover_img_source)
    print( f"added new book to database : {new_book}")
    book_data_seeding.append(new_book)


# ADD TEST USERS TO DATABASE

user_data_seeding = []
with open('data/seeding_jsons/test_user_info.json') as f:
     user_data = json.loads(f.read())

     for user in user_data:
        new_user = crud.create_user(user['email'], 
                                    user['password'], 
                                    user['user_name'])
        print( f"added new book to database : {new_user}")
        user_data_seeding.append(new_user)

        
# ADD READING STATUS TO DATABASE 

reading_data_seeding = []
with open('data/seeding_jsons/reading_status.json') as f:
     reading_data = json.loads(f.read())

for status in reading_data:
    new_status = crud.create_reading_status(status['reading_status'])

    print( f"added new reading_status to database : {new_status}")
    reading_data_seeding.append(new_status)

    
# ADD OWNED STATUS TO DATABASE

owned_data_seeding = []
with open('data/seeding_jsons/owned_status.json') as f:
     owned_data = json.loads(f.read())

for status in owned_data:
    new_owned = crud.create_owned_status(status['owned_status'])

    print( f"added new owned_status to database : {new_owned}")
    owned_data_seeding.append(new_owned)

    
    
# BOOKSHELF AND BOOKS ON BOOKSHELF TO DATA BASE
for n_user in user_data_seeding:
    new_bookshelf = crud.create_user_bookshelf(user_id=n_user.user_id, nickname=f"Shelf_{n_user.user_name}")
    print(f"added new bookshelf to database : {new_bookshelf}")


    for num in range(10):
         make_shelf_books = choice(book_data_seeding)
         reading_stat = choice(reading_data_seeding)
         owned_stat = choice(owned_data_seeding)
         new_shelved_book = crud.create_shelvedbook(new_bookshelf.shelf_id, make_shelf_books.book_id, reading_stat.reading_status_id, owned_stat.owned_id)
         
         print(f"added new book to shelf : {new_shelved_book}")
         print(f"books on shelf{new_bookshelf.books}")



for book in book_data_seeding:
     n_user = choice(user_data_seeding)
     print(n_user, book)
     comment = choice( ['Life-changing. I absolutely recommend reading this book', "Boring. Couldn't get into it", 
                         "I really wanted to like it, but the plot was kind of stale and the narrator's voice irked me. ",
                         " i love this book. the characters, the settings, so vivid and detailed. so much energy. great great read.",
                         "really well written. you can't do better in the english language for show of mastery of prose.",
                         "spoiler: the character's unbridled enthuasism led to the character's downfall."])
     new_comment = crud.create_comment(user_id=n_user.user_id, book_id = book.book_id, comment_text= comment)
     print(f"added new comment to database : {new_comment}")


    