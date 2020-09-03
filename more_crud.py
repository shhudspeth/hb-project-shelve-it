from flask import Flask, render_template, jsonify, request, session, redirect, flash
import crud
import model
import json
import api
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


def make_email():
    message = Mail(
        from_email='from_email@example.com',
        to_emails='to@example.com',
        subject='Your Shelve-It Book List',
        #html_content= shelf_info['html']
        html_content='<strong>and easy to do anywhere, even with Python</strong>'
        )

    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as err:
        print(err)
    return("sent an email!!!!!")


def add_book_to_db(new_book_info, user, shelfname):
    
    cover_img_source = 'static/images/generic-book-cover.jpg'

    # FIND BOOKSHELF
    if crud.return_user_bookshelf_by_name(user.user_id, shelfname):
        #add a shelvedbook
      
        shelf = crud.return_user_bookshelf_by_name(user.user_id, shelfname)
    # CREATE SHELF IF NECESSARY
    else:
      
        shelf = crud.create_user_bookshelf(user.user_id, shelfname)

    # FIND BOOK IN DATABASE
    if crud.get_book_by_name(new_book_info['title']):
        book = crud.get_book_by_name(new_book_info['title'])
        print("BOOK IN DB ADDING TO SHELF IF APPROPRIATE")
    
    # TODO be able to handle books with mutliple authors
    else: 
        # for key in ['title', 'publisher', 'year_published', 'isbn', 'description', 'cover_img_source']
        title = new_book_info['title'][:49]
        if 'author' in new_book_info:
            author = new_book_info['author'][0][:29]
        else:
            author = "unknown"
        if 'publisher' in new_book_info:
            publisher = new_book_info['publisher'][:29]
        else:
            publisher = "unknown"
        if 'year_published' in new_book_info:
            year_published = new_book_info['year_published']
        else: 
            year_published = '0000'
        if 'isbn' in new_book_info:
            isbn =  new_book_info['isbn'][:29]
        else:
            isbn = None
        if 'description' in new_book_info:
            description = new_book_info['description']
        else:
            description = 'unknown'
        
        if 'cover_img_source' in new_book_info:    
            cover_img_source = new_book_info['cover_img_source']
          
        
        #MAKE A NEW BOOK ADD TO DB
        book = crud.create_book(title, author, publisher, year_published, isbn, description, cover_img_source)
        
    # MAKE A SHELVED BOOK
    shelved = crud.create_shelvedbook(shelf.shelf_id, book.book_id, 5, 4)

    print("shelvedbook, try to refresh shelf", shelf, shelved)

    return ({'book_id': book.book_id, "title":book.title, 
                                'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, 'img':cover_img_source})