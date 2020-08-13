--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: books; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.books (
    book_id integer NOT NULL,
    isbn character varying(30),
    title character varying(50) NOT NULL,
    author character varying(30) NOT NULL,
    publisher character varying(50),
    year_published character varying(30),
    cover_img_source character varying(200),
    description character varying(200),
    spine_img_source character varying(200)
);


ALTER TABLE public.books OWNER TO vagrant;

--
-- Name: books_book_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.books_book_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.books_book_id_seq OWNER TO vagrant;

--
-- Name: books_book_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.books_book_id_seq OWNED BY public.books.book_id;


--
-- Name: bookshelves; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.bookshelves (
    shelf_id integer NOT NULL,
    user_id integer,
    nickname character varying(50) NOT NULL,
    sent_to_user boolean,
    public_display boolean
);


ALTER TABLE public.bookshelves OWNER TO vagrant;

--
-- Name: bookshelves_shelf_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.bookshelves_shelf_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookshelves_shelf_id_seq OWNER TO vagrant;

--
-- Name: bookshelves_shelf_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.bookshelves_shelf_id_seq OWNED BY public.bookshelves.shelf_id;


--
-- Name: owned_status; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.owned_status (
    owned_id integer NOT NULL,
    owned_text character varying(30)
);


ALTER TABLE public.owned_status OWNER TO vagrant;

--
-- Name: owned_status_owned_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.owned_status_owned_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.owned_status_owned_id_seq OWNER TO vagrant;

--
-- Name: owned_status_owned_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.owned_status_owned_id_seq OWNED BY public.owned_status.owned_id;


--
-- Name: reading_status; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.reading_status (
    reading_status_id integer NOT NULL,
    reading_status_name character varying(30)
);


ALTER TABLE public.reading_status OWNER TO vagrant;

--
-- Name: reading_status_reading_status_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.reading_status_reading_status_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.reading_status_reading_status_id_seq OWNER TO vagrant;

--
-- Name: reading_status_reading_status_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.reading_status_reading_status_id_seq OWNED BY public.reading_status.reading_status_id;


--
-- Name: shelved_books; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.shelved_books (
    bookshelfbook_id integer NOT NULL,
    shelf_id integer,
    book_id integer,
    reading_status integer,
    owned_status integer
);


ALTER TABLE public.shelved_books OWNER TO vagrant;

--
-- Name: shelved_books_bookshelfbook_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.shelved_books_bookshelfbook_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shelved_books_bookshelfbook_id_seq OWNER TO vagrant;

--
-- Name: shelved_books_bookshelfbook_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.shelved_books_bookshelfbook_id_seq OWNED BY public.shelved_books.bookshelfbook_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: vagrant
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    user_name character varying(30),
    email character varying(30) NOT NULL,
    password character varying(30) NOT NULL,
    joined_at timestamp without time zone,
    profile_link character varying(100),
    text_number character varying(100),
    contact_by_email boolean,
    contact_by_text boolean,
    share_link character varying(100),
    lat double precision,
    long double precision
);


ALTER TABLE public.users OWNER TO vagrant;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: vagrant
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO vagrant;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vagrant
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: books book_id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.books ALTER COLUMN book_id SET DEFAULT nextval('public.books_book_id_seq'::regclass);


--
-- Name: bookshelves shelf_id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.bookshelves ALTER COLUMN shelf_id SET DEFAULT nextval('public.bookshelves_shelf_id_seq'::regclass);


--
-- Name: owned_status owned_id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.owned_status ALTER COLUMN owned_id SET DEFAULT nextval('public.owned_status_owned_id_seq'::regclass);


--
-- Name: reading_status reading_status_id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.reading_status ALTER COLUMN reading_status_id SET DEFAULT nextval('public.reading_status_reading_status_id_seq'::regclass);


--
-- Name: shelved_books bookshelfbook_id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.shelved_books ALTER COLUMN bookshelfbook_id SET DEFAULT nextval('public.shelved_books_bookshelfbook_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.books (book_id, isbn, title, author, publisher, year_published, cover_img_source, description, spine_img_source) FROM stdin;
1	UOM:39015013944072	In Search of Lost Time 	Marcel Proust	unknown	1982-01-01 00:00:00	\N	unknown	\N
2	151240229X	Ulysses	James Joyce	First Avenue Editions	2016-05-01 00:00:00	\N	An extraordinary look at an ordinary day—June 16, 1904—in the life of a middle-aged Jewish man livi	\N
3	9781101525371	Don Quixote	Miguel de Cervantes	Penguin	2011-04-05 00:00:00	\N	Complete and unabridged, Don Quixote is the epic tale of the man from La Mancha and his faithful sq	\N
4	1849435286	The Great Gatsby 	F. Scott Fitzgerald	Oberon Books	2012-06-26 00:00:00	\N	So we beat on, boats against the current, borne back ceaselessly into the past. ‘F. Scott Fitzgeral	\N
5	9781586634544	One Hundred Years of Solitude 	Gabriel Garcia Marquez	Spark Publishing Group	2002-01-01 00:00:00	\N	Get your "A" in gear! They''re today''s most popular study guides-with everything you need to succe	\N
6	PRNC:32101020985469	Moby Dick	Herman Melville	unknown	1902-01-01 00:00:00	\N	unknown	\N
7	UCAL:$B320579	War and Peace	Leo Tolstoy	unknown	1917-01-01 00:00:00	\N	unknown	\N
8	9780307744029	Lolita 	Vladimir Nabokov	Vintage	2010-08-24 00:00:00	\N	Awe and exhiliration--along with heartbreak and mordant wit--abound in Lolita, Nabokov's most famou	\N
9	UOM:39015004245760	Hamlet	William Shakespeare	unknown	1917-01-01 00:00:00	\N	unknown	\N
10	9781536433944	The Catcher in the Rye	J. D. Salinger	unknown	1991-05-01 00:00:00	\N	An adolescent boy, knowing he is about to be dropped by his school, spends three days and nights in	\N
11	1416500367	The Odyssey	Homer	Simon and Schuster	2005-07-01 00:00:00	\N	Homer's great epic describes the many adventures of Odysseus, Greek warrior, as he strives over man	\N
12	UVA:X001166076	The Brothers Karamazov 	Fyodor Dostoyevsky	unknown	1922-01-01 00:00:00	\N	unknown	\N
13	1425034594	Crime and Punishment 	Fyodor Dostoyevsky	ReadHowYouWant.com	2006-11-01 00:00:00	\N	A remarkable masterpiece of Dostoyevsky in the world of Russian's fiction. It captivates the crime 	\N
14	9780140449129	Madame Bovary	Gustave Flaubert	Penguin	2003-01-01 00:00:00	\N	An unhappily married woman, Emma Bovary's unfulfilled dreams of romantic love and desperation to es	\N
15	9780199770366	The Divine Comedy 	Dante Alighieri	Oxford University Press	1961-12-31 00:00:00	\N	An invaluable source of pleasure to those English readers who wish to read this great medieval clas	\N
16	9780590433891	The Adventures of Huckleberry Finn	Mark Twain	Scholastic Inc.	1987-01-01 00:00:00	\N	A mischievous youth encounters a runaway slave and together they travel down the Mississippi in sea	\N
17	9781853261183	Alice's Adventures in Wonderland 	Lewis Carroll	Wordsworth Editions	1993-01-01 00:00:00	\N	This edition contains 'Alice's Adventures in Wonderland' and its sequel 'Through the Looking Glass'	\N
18	HARVARD:32044086796588	Pride and Prejudice	Jane Austen	unknown	1918-01-01 00:00:00	\N	Austen’s most celebrated novel tells the story of Elizabeth Bennet, a bright, lively young woman wi	\N
19	0307455181	Wuthering Heights	Emily Brontë	Vintage	2009-01-01 00:00:00	\N	The passionate love between the wealthy and pampered Catherine Earnshaw and Heathcliff, a mysteriou	\N
20	9781853260919	To the Lighthouse 	Virginia Woolf	Wordsworth Editions	1994-01-01 00:00:00	\N	To the Lighthouse features the serene and maternal Mrs. Ramsay, the tragic yet absurd Mr. Ramsay, a	\N
21	9780606237802	Catch-22 	Joseph Heller	unknown	2011-01-01 00:00:00	\N	Presents the contemporary classic depicting the struggles of a United States airman attempting to s	\N
22	0679600175	The Sound and the Fury	William Faulkner	Modern Library 100 Best Novels	1992-01-01 00:00:00	\N	Depicts the troubled childhood of Jason, Quentin, Caddy, and Benjy Compson, members of a southern f	\N
23	1849433496	Nineteen Eighty Four	George Orwell	Oberon Books	2012-06-21 00:00:00	\N	War is Peace. Freedom is Slavery. Ignorance is Strength. Winston Smith rewrites history for the Min	\N
24	0198748841	Anna Karenina	Leo Tolstoy	Oxford University Press	2016-01-01 00:00:00	\N	'Love...it means too much to me, far more than you can understand.' Anna Karenina is a beautiful an	\N
25	0199536791	The Iliad	Homer	Oxford Paperbacks	2008-07-10 00:00:00	\N	The Iliad is the story of a few days' fighting in the tenth year of the legendary war between the G	\N
26	3736800835	Heart of Darkness	Joseph Conrad	BookRix	2018-10-16 00:00:00	\N	Heart of Darkness is a short novel by Polish novelist Joseph Conrad, written as a frame narrative, 	\N
27	9780143039433	The Grapes of Wrath 	John Steinbeck	Penguin	2006-01-01 00:00:00	\N	STEINBECK/GRAPES OF WRATH (BC)	\N
28	0679732764	Invisible Man 	Ralph Ellison	Vintage	1995-01-01 00:00:00	\N	An African-American man's search for success and the American dream leads him out of college to Har	\N
29	9780871299208	To Kill a Mockingbird 	Harper Lee	Dramatic Publishing	1970-01-01 00:00:00	\N	Harper Lee's classic novel of a lawyer in the Deep South defending a black man charged with the rap	\N
30	9781853262371	Middlemarch	George Eliot	Wordsworth Editions	1994-01-01 00:00:00	\N	In nineteenth-century England, Dorthea Brooke's wishes to defy social conventions are inhibited by 	\N
\.


--
-- Data for Name: bookshelves; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.bookshelves (shelf_id, user_id, nickname, sent_to_user, public_display) FROM stdin;
1	1	Shelf_testusername	f	f
2	2	Shelf_test1username	f	f
3	3	Shelf_test2username	f	f
4	4	Shelf_test3username	f	f
5	5	Shelf_test4username	f	f
\.


--
-- Data for Name: owned_status; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.owned_status (owned_id, owned_text) FROM stdin;
1	ordered
2	borrowed
3	owned
4	loaned out
\.


--
-- Data for Name: reading_status; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.reading_status (reading_status_id, reading_status_name) FROM stdin;
1	liked
2	did not like
3	want to read
4	want to reread
5	currently reading
\.


--
-- Data for Name: shelved_books; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.shelved_books (bookshelfbook_id, shelf_id, book_id, reading_status, owned_status) FROM stdin;
1	1	15	3	3
2	1	29	4	2
3	1	12	2	3
4	1	11	4	3
5	1	15	5	4
6	1	11	2	4
7	1	29	1	3
8	1	17	3	4
9	1	18	4	1
10	1	20	2	1
11	2	28	2	2
12	2	9	5	2
13	2	29	5	4
14	2	28	2	1
15	2	20	4	4
16	2	8	4	3
17	2	25	5	2
18	2	18	1	4
19	2	6	4	1
20	2	12	3	3
21	3	29	1	2
22	3	3	4	3
23	3	3	4	3
24	3	10	3	2
25	3	29	3	3
26	3	21	3	3
27	3	21	2	4
28	3	25	2	1
29	3	4	4	2
30	3	17	3	1
31	4	25	1	4
32	4	1	5	4
33	4	17	3	1
34	4	4	3	1
35	4	23	2	3
36	4	17	1	4
37	4	14	2	2
38	4	15	3	1
39	4	7	3	4
40	4	5	1	4
41	5	19	5	2
42	5	30	3	2
43	5	21	1	3
44	5	11	5	2
45	5	12	1	4
46	5	16	3	4
47	5	4	4	2
48	5	13	1	2
49	5	19	5	2
50	5	12	2	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.users (user_id, user_name, email, password, joined_at, profile_link, text_number, contact_by_email, contact_by_text, share_link, lat, long) FROM stdin;
1	testusername	test@test.com	test	2020-08-13 22:24:38	\N	\N	\N	\N	\N	\N	\N
2	test1username	test1@test.com	test	2020-08-13 22:24:38	\N	\N	\N	\N	\N	\N	\N
3	test2username	test2@test.com	test	2020-08-13 22:24:38	\N	\N	\N	\N	\N	\N	\N
4	test3username	test3@test.com	test	2020-08-13 22:24:38	\N	\N	\N	\N	\N	\N	\N
5	test4username	test4@test.com	test	2020-08-13 22:24:38	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: books_book_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.books_book_id_seq', 30, true);


--
-- Name: bookshelves_shelf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.bookshelves_shelf_id_seq', 5, true);


--
-- Name: owned_status_owned_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.owned_status_owned_id_seq', 4, true);


--
-- Name: reading_status_reading_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.reading_status_reading_status_id_seq', 5, true);


--
-- Name: shelved_books_bookshelfbook_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.shelved_books_bookshelfbook_id_seq', 50, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vagrant
--

SELECT pg_catalog.setval('public.users_user_id_seq', 5, true);


--
-- Name: books books_isbn_key; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_isbn_key UNIQUE (isbn);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (book_id);


--
-- Name: books books_title_key; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_title_key UNIQUE (title);


--
-- Name: bookshelves bookshelves_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.bookshelves
    ADD CONSTRAINT bookshelves_pkey PRIMARY KEY (shelf_id);


--
-- Name: owned_status owned_status_owned_text_key; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.owned_status
    ADD CONSTRAINT owned_status_owned_text_key UNIQUE (owned_text);


--
-- Name: owned_status owned_status_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.owned_status
    ADD CONSTRAINT owned_status_pkey PRIMARY KEY (owned_id);


--
-- Name: reading_status reading_status_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.reading_status
    ADD CONSTRAINT reading_status_pkey PRIMARY KEY (reading_status_id);


--
-- Name: reading_status reading_status_reading_status_name_key; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.reading_status
    ADD CONSTRAINT reading_status_reading_status_name_key UNIQUE (reading_status_name);


--
-- Name: shelved_books shelved_books_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.shelved_books
    ADD CONSTRAINT shelved_books_pkey PRIMARY KEY (bookshelfbook_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: bookshelves bookshelves_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.bookshelves
    ADD CONSTRAINT bookshelves_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: shelved_books shelved_books_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.shelved_books
    ADD CONSTRAINT shelved_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(book_id);


--
-- Name: shelved_books shelved_books_owned_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.shelved_books
    ADD CONSTRAINT shelved_books_owned_status_fkey FOREIGN KEY (owned_status) REFERENCES public.owned_status(owned_id);


--
-- Name: shelved_books shelved_books_reading_status_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.shelved_books
    ADD CONSTRAINT shelved_books_reading_status_fkey FOREIGN KEY (reading_status) REFERENCES public.reading_status(reading_status_id);


--
-- Name: shelved_books shelved_books_shelf_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: vagrant
--

ALTER TABLE ONLY public.shelved_books
    ADD CONSTRAINT shelved_books_shelf_id_fkey FOREIGN KEY (shelf_id) REFERENCES public.bookshelves(shelf_id);


--
-- PostgreSQL database dump complete
--

