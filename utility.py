from flask import Flask, render_template, jsonify, request, session, redirect, flash
import crud, more_crud
import model
import json
import api
import os



def make_dict_books_a_shelf(user, shelf):

    current_user = crud.get_user_by_username(user)

    if shelf == "all":
        books_on_shelf = crud.return_all_books_on_shelves_by_user(current_user.user_id)

    else: 
        books_on_shelf = crud.return_books_on_shelf_by_nickname(shelf, current_user.user_id)

    # print("RETREIVED BOOKS ON SEHFL", books_on_shelf)
    shelf_books = []
    for book in books_on_shelf: 
    #get sheleved book info : shelf id, bookid, reading and owned statuses
    #print("SHEVLEDBOOK ID",current_user, current_user.user_id, book.book_id)
        shelf_st = crud.get_shelvedbook(current_user.user_id, book.book_id)
        #print("SHELF", shelf_st, shelf_st.bookshelf.nickname)
        own_st = crud.get_owned_status(shelf_st.owned_status)
        reading_st = crud.get_reading_status(shelf_st.reading_status)
    # print("TRYING TO GET SHELF NAME", book, book.book_id, shelf_st, shelf_st.bookshelf.nickname, shelf_st.owned_status, shelf_st.reading_status)
    # print(reading_st, own_st)
        if book.cover_img_source.startswith('http'):
            image_url = 'https'+ str(book.cover_img_source)[4:]
    
        shelf_books.append({'book_id': book.book_id, "title":book.title, 
                        'author': book.author, 'publisher': book.publisher, 
                                'description':book.description, "img":image_url, 
                                'shelf_name': shelf_st.bookshelf.nickname,
                                'shelf_id':shelf_st.bookshelf.shelf_id,
                                'reading_stat':reading_st,
                                'owned_stat':own_st
                                 })

    return shelf_books



def update_reading_status(user, book_id, reading_status=None):

    if not reading_status:
        reading_status = crud.get_reading_status(1).reading_status_name
    current_user = crud.get_user_by_username(user)
    shelved_book = crud.update_shelvedbook_reading_st(current_user.user_id, \
                            book_id, reading_status)

    return shelved_book


def update_owned_status(user, book_id, owned_status=None):

    if not owned_status:
        owned_status = crud.get_owned_status(1).owned_text
    current_user = crud.get_user_by_username(user)
    shelved_book = crud.update_shelvedbook_owned_st(current_user.user_id, \
                            book_id, owned_status)

    return shelved_book
    

