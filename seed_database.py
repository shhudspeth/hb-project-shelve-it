import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

# os.system('dropdb shelve_it')
# os.system('createdb shelve_it')

# model.connect_to_db(server.app)
# model.db.create_all()

# ['items'][0]['volumeInfo'], 'link' :page.content.json()['items'][0]['selfLink']
# load data from json file and creates Movie objects for database
with open('book_api_data.json') as f:
     book_data = json.loads(f.read())

book_dictionary_again = {}
for no, book in enumerate(book_data):
    if no >= 30 and no not in [35, 36]:
        title = book
        author = book_data[book]['author']
        # print(book)
        if 'publisher' in book_data[book]['response']['items'][0]['volumeInfo']:
            publisher = book_data[book]['response']['items'][0]['volumeInfo']['publisher']
        else:
            publisher = 'unknown'
        if 'description' in book_data[book]['response']['items'][0]['volumeInfo']:
            description = book_data[book]['response']['items'][0]['volumeInfo']['description']
        else:
            description= 'unknown'
        # description = book_data[book]['response']['items'][0]['volumeInfo']['description']
        year_published = book_data[book]['response']['items'][0]['volumeInfo']['publishedDate']
        cover_img_source = book_data[book]['response']['items'][0]['volumeInfo']['imageLinks']
        if len(book_data[book]['response']['items'][0]['volumeInfo']['industryIdentifiers']) > 1:
            isbn = book_data[book]['response']['items'][0]['volumeInfo']['industryIdentifiers'][1]['identifier']
        
        else:
            isbn = book_data[book]['response']['items'][0]['volumeInfo']['industryIdentifiers'][0]['identifier']
        try:
            published_date = datetime.strptime(year_published,"%Y-%m-%d")
        except:
            try:
                published_date = datetime.strptime(year_published,"%Y")
            except:
                published_date =datetime.strptime(year_published,"%Y-%m")
        # new_book = crud.create_book(title, overview, release_date, poster_path)
        print("added a book to database")

        book_dictionary_again[ title] = {
            'title': title, 
            'author': author, 
            'publisher': publisher, 
            'year_published': str(published_date),
            'isbn': isbn, 
            'description': description,  
            'cover_img_source' : cover_img_source}


with open("better_book_data2.json", "w") as outfile:  
        json.dump(book_dictionary_again, outfile, indent=4)