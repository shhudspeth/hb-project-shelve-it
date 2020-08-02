import io
import os

from flask import Flask, request, flash, session, render_template, jsonify
from random import choice

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# Creates the flask app
app = Flask(__name__)

# a secret key for Flask sessioning
app.secret_key = 'to-be-determined'

UPLOAD_FOLDER = '/static/images'

# Instantiates a client
client = vision.ImageAnnotatorClient()

# The name of the image file to annotate
# file_name = os.path.abspath('/home/vagrant/src/hb_project/static/images/demo1.png')


# print(response)
# print('Labels:')
# for label in labels:
#     print(label.description)



@app.route('/', methods=['GET', 'POST'])
def show_index():
    """Show the index page"""
    if request.method == 'POST':
        
        file = request.form['books']
        # TO FIGURE OUT STORAGE FOR LATER 
        # Loads the image into memory
        #filename = secure_filename(file.filename)
        #file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        with io.open('static/images/'+file, 'rb') as image_file:
            content = image_file.read()

        image = types.Image(content=content)


        # Performs text detection on the image file
        response = client.annotate_image({'image':image})

        return render_template('index.html', response=response, file=file)


    return render_template('index.html')



@app.route('/return-book-text')
def return_book_text(response):
    return jsonify({'book_descriptions': response.text_annotations[0].description})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
