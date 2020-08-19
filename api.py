# a utility function files for api calls
import io
import os
import sys
# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types


google_api_key = os.environ.get('key')
print(google_api_key, "PRINT GOOGLE KEY")
UPLOAD_FOLDER = '/static/images'

# Instantiates a client
client = vision.ImageAnnotatorClient()

# The name of the image file to annotate
# file_name = os.path.abspath('/home/vagrant/src/hb_project/static/images/demo1.png')
 # Get the name of image file to load

def text_from_photo(image_file_path):
    # Open image file and load
    with io.open(image_file_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)

    # Performs text detection on the image file
    response = client.annotate_image({'image':image})

    return response

# def find_book_boundaries(response):
#     print(response.image_properties_annotation)

# TO FIGURE OUT STORAGE FOR LATER 
# Loads the image into memory
#filename = secure_filename(file.filename)
#file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))


def find_book_breaks(response):
    print(response.text_annotations[0].description.split('\n'))

    return (response.text_annotations[0].description.split('\n'))

def find_google_book_data(book, author):
    title = data[item][0]
    author = data[item][1]

    link = f"https://www.googleapis.com/books/v1/volumes?q={title}+inauthor:{author}&key={google_api_key}"



if __name__ == '__main__':

    file = sys.argv[1]
    response = text_from_photo(f"static/images/{file}")