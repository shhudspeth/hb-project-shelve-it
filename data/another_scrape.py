import csv
import requests
import bs4
import re
from datetime import date
import json

# load https://thegreatestbooks.org/

# beautiful soup https://thegreatestbooks.org/

# use h4 text to find books and author

# save a list of book and author


def scrape_soup():
    
    base_link = 'https://thegreatestbooks.org/'
    soup = run_bs4(base_link)
    
    dict_books = {}
    today = date.today()
    
    for no, row in enumerate(soup.find_all('h4')):
        # print(f" NEW BOOK COMBO {row}/n")
        if no < 50:
            items = [x.contents[0] for  x in row.find_all('a')]
            print(no, items)
            dict_books[no] = items

    with open("book_samples.json", "w") as outfile:  
        json.dump(dict_books, outfile)
    


def run_bs4(link, lxml=None):
    user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
    headers = {'User-Agent': user_agent}
    page = requests.get(link)
    html = page.content
    soup = bs4.BeautifulSoup(html, 'html.parser')
    return(soup)


if __name__ == '__main__':
    today = date.today()
    book_scrape = scrape_soup()
    # df_watch= pd.DataFrame.from_dict(watch_csv, orient='index').to_csv("~/watches_project/core/watches"+str(today)+".csv", index=False)



