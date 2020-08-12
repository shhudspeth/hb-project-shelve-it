import os
import json
from random import choice, randint
from datetime import datetime

import crud
import model
import server

os.system('dropdb shelve_it')
os.system('createdb shelve_it')

model.connect_to_db(server.app)
model.db.create_all()

# load data from json file and creates Movie objects for database
with open('data/books.json') as f:
    book_data = json.loads(f.read())