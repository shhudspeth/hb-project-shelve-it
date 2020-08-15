import io
import os

from flask import Flask, request, flash, session, render_template, jsonify, redirect
from random import choice

from google.protobuf.json_format import MessageToJson


import api
import crud
import model

# Creates the flask app
app = Flask(__name__)

# a secret key for Flask sessioning
app.secret_key = 'to-be-determined'


@app.route('/', methods=['GET', 'POST'])
def show_index():
    """Show the index page"""
    if request.method == 'POST':
        file = request.form['books']
        response = api.text_from_photo(f"static/images/{file}")
        return render_template('index.html', response=response, file=file)


    return render_template('index.html')



@app.route('/return-book-text')
def return_book_text(response):
    return jsonify({'book_descriptions': response.text_annotations[0].description})

@app.route('/register')
def register_new_count():
    return render_template('registration.html')


@app.route('/bookshelf', methods=["GET", "POST"])
def display_bookshelf():
    if request.method == 'POST':
        file = request.form['books']
        response = api.text_from_photo(f"static/images/{file}")
        # serialized = MessageToJson()
        session['response'] = response.text_annotations[0].description
        session['file'] = file
        return redirect('/bookshelf')
    
    #books = crud.

    return render_template('bookshelf.html')


@app.route("/login", methods=["GET"])
def show_login():
    """Show login form."""

    return render_template("login.html")


@app.route("/login", methods=["POST"])
def process_login():
    """Log user into site.

    Find the user's login credentials located in the 'request.form'
    dictionary, look up the user, and store them in the session.
    """

    user_email = request.form.get('email')
    if crud.get_user_by_email(user_email):
        current_user = crud.get_user_by_email(user_email)
        print(current_user.email, user_email)
        if current_user.password == request.form.get('password'):
            session['user'] = current_user.user_name
            flash("You've logged in successfully. Welcome to your Shelve-It account.")
            return redirect('/bookshelf')
        else:
            flash('Incorrect Password. Please try again')
            return redirect('/login')
    else:
        flash("No account with that email exists. Please create one or try again")
        return redirect('/register')


# # TODO ROUTES
#     1. Make Logout
#     2. Make upload page
#     3. Make bookshelf/user page
#     4. make book page (LIKE, DISLIKE, WANT TO READ)
#     5. make route to text or email books

if __name__ == '__main__':
    model.connect_to_db(app)
    app.run(debug=True, host='0.0.0.0')
    
