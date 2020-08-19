# a utility function files for api calls
import io
import os
import sys
import requests
# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types
import datetime


google_api_key = os.environ.get('key')
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

    return (response.text_annotations[0].description.split('\n'))

def find_google_book_data(title, author):

    link = f"https://www.googleapis.com/books/v1/volumes?q={title}+inauthor:{author}&key={google_api_key}"
    response = requests.get(link).json()
    book_json = {'title': response['items'][0]['volumeInfo']['title'], 'author': response['items'][0]['volumeInfo']['authors'], 'response': response}
    print("CAPTURED", book_json['title'], "\n\n")
    return(book_json)


def parse_response_data_for_info(book_data):

    title = book_data['title']
    author = book_data['author']

    if 'publisher' in book_data['response']['items'][0]['volumeInfo']:
            publisher = book_data['response']['items'][0]['volumeInfo']['publisher']
    else:
        publisher = 'unknown'

    if 'description' in book_data['response']['items'][0]['volumeInfo']:
         description = book_data['response']['items'][0]['volumeInfo']['description']
    else:
        description= 'unknown'
   
    description = book_data['response']['items'][0]['volumeInfo']['description']
    year_published = book_data['response']['items'][0]['volumeInfo']['publishedDate']
    cover_img_source = book_data['response']['items'][0]['volumeInfo']['imageLinks']['thumbnail']

    if len(book_data['response']['items'][0]['volumeInfo']['industryIdentifiers']) > 1:
        isbn = book_data['response']['items'][0]['volumeInfo']['industryIdentifiers'][1]['identifier']
    else:
        isbn = book_data['response']['items'][0]['volumeInfo']['industryIdentifiers'][0]['identifier']
    # try:
    #     published_date = datetime.strptime(year_published,"%Y-%m-%d")
    # except:
       
    #     try:
    #         published_date = datetime.strptime(year_published,"%Y")
    #     except:
    #         published_date =datetime.strptime(year_published,"%Y-%m")
    
    return({
            'title': title, 
            'author': author, 
            'publisher': publisher, 
            'year_published': year_published,
            'isbn': isbn, 
            'description': description,  
            'cover_img_source' : cover_img_source
            })

if __name__ == '__main__':
    if len(sys.argv) > 1:
        file = sys.argv[1]
        response = text_from_photo(f"static/images/{file}")
    else:
        book_json = find_google_book_data("secret garden", "frances burnett")
        book_info_for_db = parse_response_data_for_info(book_json)