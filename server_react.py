from flask import Flask, render_template, jsonify, request, session, redirect, flash
import crud
import model

app = Flask(__name__)
app.secret_key = 'to-be-determined'

@app.route("/")
def root():
    return render_template("root.html")


@app.route("/login", methods=["POST"])
def process_login():
    """Log user into site.

    Find the user's login credentials located in the 'request.form'
    dictionary, look up the user, and store them in the session.
    """

    user_email = request.get_json()
    if crud.get_user_by_email(user_email):
        current_user = crud.get_user_by_email(user_email)
        print(current_user.email, user_email)
        if current_user.password == request.form.get('password'):
            session['user'] = current_user.user_name
            flash("You've logged in successfully. Welcome to your Shelve-It account.")
            # return redirect('/bookshelf')
        else:
            flash('Incorrect Password. Please try again')
            return redirect('/login')
    else:
        flash("No account with that email exists. Please create one or try again")
        return redirect('/register')

@app.route('/register', methods=["POST"])
def register_new_account():
    data = request.get_json()
    print(data)
    email = data['email']
    pswd = data['password']
    uname = data['username']
    phnum = data['phone_number']
    email_text = data['email_or_text']
    public = data['public_shelf']
    zipc = data['zipcode']

    new_user = crud.create_user_register(email, pswd, uname, phnum, email_text, public, zipc)


    if new_user:
        return (jsonify({'message':'ok'}))
    else:
        return (jsonify({'message':'somethinghappened. user might not have been made'}))



    

@app.route("/api/top-posts")
def get_top_posts():
    # get top posts from the DB 
    # package them up nicely into a list of dicts
    
    top_posts = [
    {"id": 93, "title": "why kiwis are the best fruit, part 9", "body": " body text for p1"},
    {"id": 783, "title": "typsetting in the 19th century", "body": " body text for p2"},
    {"id": 1383, "title": "debugging, a lifes tale", "body": " body text for p3"}
    ]
    
    return jsonify(top_posts)

@app.route("/api/post", methods=["POST"])
def post():
    
    # im expecting this kind of object as JSON in the request
    # {"post_title": "post 1", "post_body": "stuf stuf stuf"}

    data = request.get_json()
    post_title = data.post_title
    post_body = data.post_body

    # do stuff to create that post in the DB

if __name__ == "__main__":
    model.connect_to_db(app)
    app.run(debug=True, host="0.0.0.0")


# 6 valid data types for JSON
# strings 
# arrays 
# objects 
# numbers 
# boolean 
# null
