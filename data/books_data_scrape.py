import json
import requests

# get book and author names from pictures

#  with io.open('static/images/'+file, 'rb') as image_file:
#             content = image_file.read()

#         image = types.Image(content=content)

#         # Performs text detection on the image file
#         response = client.annotate_image({'image':image})
#         response.text_annotations[0].description

    #   other extensions to play with
    #     'context', 'crop_hints_annotation', 'error', 'face_annotations', 'full_text_annotation',
    #    'image_properties_annotation', 'label_annotations', 'landmark_annotations',
    #     'localized_object_annotations', 'logo_annotations', 'product_search_results', 
    #     'safe_search_annotation', 'text_annotations', 'web_detection'


# make a list of titles and authors
book_json = {}


with open('book_samples.json') as json_file: 
    data = json.load(json_file) 

for item in data:
    title = data[item][0]
    author = data[item][1]
    link = f"https://www.googleapis.com/books/v1/volumes?q={title}+inauthor:{author}&key={google_api_key}"
    page = requests.get(link)
    book_json[title] = {'title':title, 'author': author, 'response': page.json()}
    print("CAPTURED", book_json[title]['title'], "\n\n")
# get google book api data based on titles and authors

with open("book_api_data.json", "w") as outfile:  
        json.dump(book_json, outfile)




# how to access pertinent info, hopefully
# ['items'][0]['volumeInfo'], 'link' :page.content.json()['items'][0]['selfLink']

# another scrape:

with open('data/seeding_jsons/better_book_data.json') as f:
     book_data = json.loads(f.read())
     
book_dictionary_again = {}
for no, book in enumerate(book_data):
    if no >= 30 and no not in [35, 36]:
        title = book
        author = book_data[book]['author']
        # print(book)
        if 'publisher' in book_data[book]['response']['items'][0]['volumeInfo']:
            publisher = book_data[book]['response']['items'][0]['volumeInfo']['publisher']
        else:
            publisher = 'unknown'
        if 'description' in book_data[book]['response']['items'][0]['volumeInfo']:
            description = book_data[book]['response']['items'][0]['volumeInfo']['description']
        else:
            description= 'unknown'
        # description = book_data[book]['response']['items'][0]['volumeInfo']['description']
        year_published = book_data[book]['response']['items'][0]['volumeInfo']['publishedDate']
        cover_img_source = book_data[book]['response']['items'][0]['volumeInfo']['imageLinks']['thumbnail']
        if len(book_data[book]['response']['items'][0]['volumeInfo']['industryIdentifiers']) > 1:
            isbn = book_data[book]['response']['items'][0]['volumeInfo']['industryIdentifiers'][1]['identifier']
        
        else:
            isbn = book_data[book]['response']['items'][0]['volumeInfo']['industryIdentifiers'][0]['identifier']
        try:
            published_date = datetime.strptime(year_published,"%Y-%m-%d")
        except:
            try:
                published_date = datetime.strptime(year_published,"%Y")
            except:
                published_date =datetime.strptime(year_published,"%Y-%m")
        # new_book = crud.create_book(title, overview, release_date, poster_path)
        print("added a book to database")

        book_dictionary_again[ title] = {
            'title': title, 
            'author': author, 
            'publisher': publisher, 
            'year_published': str(published_date),
            'isbn': isbn, 
            'description': description,  
            'cover_img_source' : cover_img_source}


with open("better_book_data2.json", "w") as outfile:  
        json.dump(book_dictionary_again, outfile, indent=4)