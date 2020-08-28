# a utility function files for api calls
import io
import os
import sys
import requests
# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types
import datetime

import argparse
from PIL import Image, ImageDraw



google_api_key = os.environ.get('key')
UPLOAD_FOLDER = '/static/images'

# Instantiates a client
client = vision.ImageAnnotatorClient()


def get_googlevision_response(image_file_path):
    # Open image file and load
    with io.open(image_file_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)

    # Performs text detection on the image file
    response = client.annotate_image({'image':image})

    return response.full_text_annotation.text


def get_response(image_file_path):
    # Open image file and load
    with io.open(image_file_path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)

    # Performs text detection on the image file
    response = client.annotate_image({'image':image})

    return response


def localize_objects_with_crop(path):
    """Localize objects in the local image.

    Args:
    path: The path to the local file.
    """
    from google.cloud import vision
    client = vision.ImageAnnotatorClient()

    with open(path, 'rb') as image_file:
        content = image_file.read()
    image = vision.types.Image(content=content)

    objects = client.object_localization(
        image=image).localized_object_annotations
    new_crops_of_books = []
    print('Number of objects found: {}'.format(len(objects)))
    for num, object_ in enumerate(objects):
        # print('\n{} (confidence: {})'.format(object_.name, object_.score))
        # print('Normalized bounding polygon vertices: ')
        vertices = []
       
        for vertex in object_.bounding_poly.normalized_vertices:
            vertices.append(vertex)
        # print("PRINTING", vertices)
        
        im = Image.open(path)
        print(im.tile)
        width = im.width
        height = im.height
        # print((vertices[0].x, vertices[1].y, vertices[2].x, vertices[2].y))

        im2 = im.crop(box = (vertices[0].x*width, vertices[0].y*height, vertices[1].x*width, vertices[2].y*height))
        print(im2.size)
        
        new_crop_object = object_.name+ str(num)
        new_file_name = 'static/images/' + new_crop_object+'.png'
        im2.save(new_file_name)
        print('Saved new image')
        new_crops_of_books.append(new_file_name)
    
    return(new_crops_of_books)

            #print(' - ({}, {})'.format(vertex.x, vertex.y))


def get_crop_hint(path):
    """Detect crop hints on a single image and return the first result."""
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)

    crop_hints_params = types.CropHintsParams(aspect_ratios=[1.77])
    image_context = types.ImageContext(crop_hints_params=crop_hints_params)

    response = client.crop_hints(image=image, image_context=image_context)
    hints = response.crop_hints_annotation.crop_hints

    # Get bounds for the first crop hint using an aspect ratio of 1.77.
    vertices = hints[0].bounding_poly.vertices

    return vertices


def draw_hint(image_file):
    """Draw a border around the image using the hints in the vector list."""
    vects = get_crop_hint(image_file)

    im = Image.open(image_file)
    draw = ImageDraw.Draw(im)
    draw.polygon([
        vects[0].x, vects[0].y,
        vects[1].x, vects[1].y,
        vects[2].x, vects[2].y,
        vects[3].x, vects[3].y], None, 'red')
    im.save('static/images/output-hint.png', 'PNG')
    print('Saved new image to output-hint.png')
    return('output-crop.png')


def crop_to_hint(image_file):
    """Crop the image using the hints in the vector list."""
    vects = get_crop_hint(image_file)

    im = Image.open(image_file)
    im2 = im.crop([vects[0].x, vects[0].y,
                  vects[2].x - 1, vects[2].y - 1])
    im2.save('output-crop.png', 'PNG')
    print('Saved new image to output-crop.png')
    return('output-crop.png')


def find_book_boundaries(response):
    print("LENGTH oF IMAGE PROP :", response.image_properties_annotation)
    print("LENG OF OBJECT PROP:" , len(response.localized_object_annotations))
    print("LENGTH OF CROP HINTS:", len(response.crop_hints_annotation))

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

def find_google_book_data_onetitle(title):

    link = f"https://www.googleapis.com/books/v1/volumes?q={title}&key={google_api_key}"
    response = requests.get(link).json()
    if response['items'][0]['volumeInfo']:
        book_json = {'title': response['items'][0]['volumeInfo']['title'], 'response': response}
        print("CAPTURED", book_json['title'], "\n\n")
        return(book_json)
    else:
        print("ERROR", response)

def parse_response_data_for_info(book_data):

    title = book_data['response']['items'][0]['volumeInfo']['title']

    if 'authors' in book_data['response']['items'][0]['volumeInfo']:
        author= book_data['response']['items'][0]['volumeInfo']['authors']
    else:
        author = 'unknown'
    

    if 'publisher' in book_data['response']['items'][0]['volumeInfo']:
            publisher = book_data['response']['items'][0]['volumeInfo']['publisher']
    else:
        publisher = 'unknown'

    if 'description' in book_data['response']['items'][0]['volumeInfo']:
         description = book_data['response']['items'][0]['volumeInfo']['description']
    else:
        description= 'unknown'
   
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
    


    # parser = argparse.ArgumentParser()
    # parser.add_argument('image_file', help='The image you\'d like to crop.')
    # parser.add_argument('mode', help='Set to "crop" or "draw".')
    # args = parser.parse_args()

    # if args.mode == 'crop':
    #     new_crop=crop_to_hint(f"static/images/{args.image_file}")
    #     last_crop = crop_to_hint(new_crop)
    #     response = get_googlevision_response(last_crop)
    #     print(response.full_text_annotation.text)
    #     print(response.full_text_annotation.text.split('\n'))
    # elif args.mode == 'draw':
    #     draw_hint(f"static/images/{args.image_file}")

    def get_text_from_list_of_photos(photos):
        text_of_photos = []
        for photo in new_photos:
            print(photo)
            text = get_googlevision_response(photo)
            text = text.replace('\n', ' ')
            print(text)
            text_of_photos.append(text)
        return text_of_photos




    if len(sys.argv) > 1:
        file = sys.argv[1]
        new_photos = localize_objects_with_crop(f"static/images/{file}")
        book_titles = get_text_from_list_of_photos(new_photos)
        book_dictions = {}
        for book in book_titles:
            got_book =  find_google_book_data_onetitle(book)
            book_dictions[got_book['title']] = parse_response_data_for_info(got_book)
            print(got_book['title'])



        # exresponse = get_googlevision_response(f"static/images/{file}")
        # print(find_book_boundaries(response))
    #     print(get_crop_hint(f"static/images/{file}"))
    # else:
    #     book_json = find_google_book_data("secret garden", "frances burnett")
    #     book_info_for_db = parse_response_data_for_info(book_json)
        