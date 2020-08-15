# a utility function files for api calls
import io
import os
import sys
# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types


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


if __name__ == '__main__':

    file = sys.argv[1]
    response = text_from_photo(f"static/images/{file}")