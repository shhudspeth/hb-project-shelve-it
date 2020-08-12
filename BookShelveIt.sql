CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "user_name" varchar,
  "email" varchar,
  "password" varchar,
  "profile_link" varchar,
  "text_number" int,
  "contact_by_email" boolean,
  "contact_by_phone" boolean,
  "share_link" varchar,
  "lat" float,
  "long" float,
  "user_book_source_id" int
);

CREATE TABLE "book" (
  "book_id" SERIAL PRIMARY KEY,
  "isbn" int,
  "title" varchar,
  "author" varchar,
  "publisher" varchar,
  "year_published" int,
  "frontcover_img_source" varchar,
  "description" varchar,
  "spine_img_source" varchar
);

CREATE TABLE "reading_status" (
  "reading_id" [pk],
  "reading_status_name" varchar
);

CREATE TABLE "shelvedBook" (
  "bookshelfBook_id" SERIAL PRIMARY KEY,
  "shelf_id" int,
  "book_id" int,
  "reading_status" int,
  "owned_status" int,
  "color_palette_id" int
);

CREATE TABLE "owned_status" (
  "owned_id" SERIAL PRIMARY KEY,
  "owned_text" varchar
);

CREATE TABLE "color_schemes" (
  "color_palette_id" SERIAL PRIMARY KEY,
  "color_nums" int
);

CREATE TABLE "genre" (
  "genre_id" SERIAL PRIMARY KEY,
  "name" varchar
);

CREATE TABLE "bookgenre" (
  "bookgenre_id" SERIAL PRIMARY KEY,
  "book_id" int,
  "genre_id" int
);

CREATE TABLE "bookshelf" (
  "shelf_id" SERIAL PRIMARY KEY,
  "user_id" int,
  "nickname" varchar,
  "sent_to_user" boolean,
  "public_display" boolean
);

CREATE TABLE "userBookSources" (
  "user_book_source_id" SERIAL PRIMARY KEY,
  "user_libraries_id" int,
  "user_bookstores_id" int
);

CREATE TABLE "library" (
  "library_id" SERIAL PRIMARY KEY,
  "link_library" varchar,
  "search_api_format" varchar
);

CREATE TABLE "indieBookstore" (
  "bookstore_id" SERIAL PRIMARY KEY,
  "link_bookstore" varchar,
  "search_api_format" varcahr
);

CREATE TABLE "user_library" (
  "user_lib_id" SERIAL PRIMARY KEY,
  "library_id" int
);

CREATE TABLE "user_bookstores" (
  "user_stores_id" SERIAL PRIMARY KEY,
  "store_id" int
);

ALTER TABLE "users" ADD FOREIGN KEY ("user_book_source_id") REFERENCES "userBookSources" ("user_book_source_id");

ALTER TABLE "shelvedBook" ADD FOREIGN KEY ("shelf_id") REFERENCES "bookshelf" ("shelf_id");

ALTER TABLE "shelvedBook" ADD FOREIGN KEY ("book_id") REFERENCES "book" ("book_id");

ALTER TABLE "shelvedBook" ADD FOREIGN KEY ("reading_status") REFERENCES "reading_status" ("reading_id");

ALTER TABLE "shelvedBook" ADD FOREIGN KEY ("owned_status") REFERENCES "owned_status" ("owned_id");

ALTER TABLE "shelvedBook" ADD FOREIGN KEY ("color_palette_id") REFERENCES "color_schemes" ("color_palette_id");

ALTER TABLE "bookgenre" ADD FOREIGN KEY ("book_id") REFERENCES "book" ("book_id");

ALTER TABLE "bookgenre" ADD FOREIGN KEY ("genre_id") REFERENCES "genre" ("genre_id");

ALTER TABLE "bookshelf" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "userBookSources" ADD FOREIGN KEY ("user_libraries_id") REFERENCES "user_library" ("user_lib_id");

ALTER TABLE "userBookSources" ADD FOREIGN KEY ("user_bookstores_id") REFERENCES "user_bookstores" ("user_stores_id");

ALTER TABLE "user_library" ADD FOREIGN KEY ("library_id") REFERENCES "library" ("library_id");

ALTER TABLE "user_bookstores" ADD FOREIGN KEY ("store_id") REFERENCES "indieBookstore" ("bookstore_id");
