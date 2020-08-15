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
    description character varying,
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
2	151240229X	Ulysses	James Joyce	First Avenue Editions	2016-05-01 00:00:00	\N	An extraordinary look at an ordinary day—June 16, 1904—in the life of a middle-aged Jewish man living in Dublin, Ireland. Leopold Bloom, who is sure that his wife is being unfaithful, must come to terms with how that affects their marriage and whether it changes the nature of their love for one another. Richly detailed stream-of-consciousness narration immerses the reader in the thoughts and emotions of the characters as they deal with the normal events of daily life in Dublin, as well as grander issues like sexuality, prejudice, birth, and death. This is an unabridged version of Irish author James Joyce's groundbreaking modernist tale, which parallels Homer's Odyssey. It was first published serially in the American journal The Little Review between 1918 and 1921, and published in novel form in 1922 in Paris.	\N
3	9781101525371	Don Quixote	Miguel de Cervantes	Penguin	2011-04-05 00:00:00	\N	Complete and unabridged, Don Quixote is the epic tale of the man from La Mancha and his faithful squire, Sancho Panza. Their picaresque adventures in the world of seventeenth-century Spain form the basis of one of the great treasures of Western literature. In a new translation that “comes closest, among the modern translations, to the simple, intimate, direct style that characterizes Cervantes’ narrative,”* Don Quixote is a novel that is both immortal satire of an outdated chivalric code and a biting portrayal of an age in which nobility was a form of madness. *John J. Allen, Professor Emeritus of Spanish, University of Kentucky and Past President of the Cervantes Society of America	\N
4	1849435286	The Great Gatsby 	F. Scott Fitzgerald	Oberon Books	2012-06-26 00:00:00	\N	So we beat on, boats against the current, borne back ceaselessly into the past. ‘F. Scott Fitzgerald’s novel The Great Gatsby was first published on April 10, 1925. Set on Long Island’s North Shore and in New York City during the summer of 1922, it is the story of an attractive young man, hopelessly in love, who, having worked so hard to improve himself so he can win back the woman he loves, finds himself in a world where money has replaced humility and despair has replaced hope. For me, the novel is a comment on the values and cynicism of east coast America almost a hundred years ago, a time when a section of society had suddenly become very wealthy and the American Dream was for most, nothing more than the mere pursuit of money.’ Peter Joucla ‘Peter Joucla’s surprisingly clear-eyed adaptation cuts to the heart of Fitzgerald’s text while preserving a very decent amount of it.’ 4 stars –Evening Standard ‘Evoking all the glamour and atmosphere of the roaring twenties, Wilton’s brings Gatsby to glorious, all-singing, all-dancing life (jazz hands optional). A must-see’ – welovethisbook.com ‘An unashamed nostalgia party for a world we never knew... This is a show that majors in fun; and it’s no surprise to see it’s a cult hit.’ Telegraph	\N
5	9781586634544	One Hundred Years of Solitude 	Gabriel Garcia Marquez	Spark Publishing Group	2002-01-01 00:00:00	\N	Get your "A" in gear! They''re today''s most popular study guides-with everything you need to succeed in school. Written by Harvard students for students, since its inception SparkNotes™ has developed a loyal community of dedicated users and become a major education brand. Consumer demand has been so strong that the guides have expanded to over 150 titles. SparkNotes''™ motto is Smarter, Better, Faster because: · They feature the most current ideas and themes, written by experts. · They''re easier to understand, because the same people who use them have also written them. · The clear writing style and edited content enables students to read through the material quickly, saving valuable time. And with everything covered--context; plot overview; character lists; themes, motifs, and symbols; summary and analysis, key facts; study questions and essay topics; and reviews and resources--you don''t have to go anywhere else!	\N
6	PRNC:32101020985469	Moby Dick	Herman Melville	unknown	1902-01-01 00:00:00	\N	unknown	\N
7	UCAL:$B320579	War and Peace	Leo Tolstoy	unknown	1917-01-01 00:00:00	\N	unknown	\N
8	9780307744029	Lolita 	Vladimir Nabokov	Vintage	2010-08-24 00:00:00	\N	Awe and exhiliration--along with heartbreak and mordant wit--abound in Lolita, Nabokov's most famous and controversial novel, which tells the story of the aging Humbert Humbert's obsessive, devouring, and doomed passion for the nymphet Dolores Haze. Lolita is also the story of a hypercivilized European colliding with the cheerful barbarism of postwar America. Most of all, it is a meditation on love--love as outrage and hallucination, madness and transformation.	\N
9	UOM:39015004245760	Hamlet	William Shakespeare	unknown	1917-01-01 00:00:00	\N	unknown	\N
10	9781536433944	The Catcher in the Rye	J. D. Salinger	unknown	1991-05-01 00:00:00	\N	An adolescent boy, knowing he is about to be dropped by his school, spends three days and nights in New York City.	\N
11	1416500367	The Odyssey	Homer	Simon and Schuster	2005-07-01 00:00:00	\N	Homer's great epic describes the many adventures of Odysseus, Greek warrior, as he strives over many years to return to his home island of Ithaca after the Trojan War. His colourful adventures, his endurance, his love for his wife and son have the same power to move and inspire readers today as they did in Archaic Greece, 2800 years ago.	\N
12	UVA:X001166076	The Brothers Karamazov 	Fyodor Dostoyevsky	unknown	1922-01-01 00:00:00	\N	unknown	\N
13	1425034594	Crime and Punishment 	Fyodor Dostoyevsky	ReadHowYouWant.com	2006-11-01 00:00:00	\N	A remarkable masterpiece of Dostoyevsky in the world of Russian's fiction. It captivates the crime and psychological tensions of life. It is a tragic tale of a protagonist Raskolnikov, who puts his philosophical theories to the trial of murder eventually. He is incapable to understand the feelings of love and commiseration because he regards himself as a pariah. Mesmerizing!	\N
14	9780140449129	Madame Bovary	Gustave Flaubert	Penguin	2003-01-01 00:00:00	\N	An unhappily married woman, Emma Bovary's unfulfilled dreams of romantic love and desperation to escape the ordinary boredom of her life lead her to a series of desperate acts, including adultery, in a classic novel set against the backdrop of nineteenth-	\N
15	9780199770366	The Divine Comedy 	Dante Alighieri	Oxford University Press	1961-12-31 00:00:00	\N	An invaluable source of pleasure to those English readers who wish to read this great medieval classic with true understanding, Sinclair's three-volume prose translation of Dante's Divine Comedy provides both the original Italian text and the Sinclair translation, arranged on facing pages, and commentaries, appearing after each canto, which serve as brilliant examples of genuine literary criticism.	\N
16	9780590433891	The Adventures of Huckleberry Finn	Mark Twain	Scholastic Inc.	1987-01-01 00:00:00	\N	A mischievous youth encounters a runaway slave and together they travel down the Mississippi in search of adventure.	\N
17	9781853261183	Alice's Adventures in Wonderland 	Lewis Carroll	Wordsworth Editions	1993-01-01 00:00:00	\N	This edition contains 'Alice's Adventures in Wonderland' and its sequel 'Through the Looking Glass'. It is illustrated throughout by Sir John Tenniel, whose drawings for the books add so much to the enjoyment of them. Tweedledum and Tweedledee, the Mad Hatter, the Cheshire Cat, the Red Queen and the White Rabbit all make their appearances, and are now familiar figures in writing, conversation and idiom. So too, are Carroll's delightful verses such as 'The Walrus and the Carpenter' and the inspired jargon of that masterly Wordsworthian parody, 'The Jabberwocky'. AUTHOR: Charles Lutwidge (27 January 1832 - 14 January 1898), better known by the pen name Lewis Carroll was an English author, mathematician, logician, Anglican and photographer. His most famous writings are 'Alice's Adventures in Wonderland' and its sequel 'Through the Looking Glass' as well as the poems 'The Hunting of the Snark' and 'jabberwocky', all considered to be within the genre of literary nonsense. His facility at word play, logic, and fantasy has delighted audiences ranging from children to the literary elite, and beyond this his work has become embedded deeply in modern culture, directly influencing many artists.	\N
18	HARVARD:32044086796588	Pride and Prejudice	Jane Austen	unknown	1918-01-01 00:00:00	\N	Austen’s most celebrated novel tells the story of Elizabeth Bennet, a bright, lively young woman with four sisters, and a mother determined to marry them to wealthy men. At a party near the Bennets’ home in the English countryside, Elizabeth meets the wealthy, proud Fitzwilliam Darcy. Elizabeth initially finds Darcy haughty and intolerable, but circumstances continue to unite the pair. Mr. Darcy finds himself captivated by Elizabeth’s wit and candor, while her reservations about his character slowly vanish. The story is as much a social critique as it is a love story, and the prose crackles with Austen’s wry wit.	\N
19	0307455181	Wuthering Heights	Emily Brontë	Vintage	2009-01-01 00:00:00	\N	The passionate love between the wealthy and pampered Catherine Earnshaw and Heathcliff, a mysterious orphan, mirrors the powerful moods of the Yorkshire moors, in a classic novel of class, love, and revenge. Reprint.	\N
20	9781853260919	To the Lighthouse 	Virginia Woolf	Wordsworth Editions	1994-01-01 00:00:00	\N	To the Lighthouse features the serene and maternal Mrs. Ramsay, the tragic yet absurd Mr. Ramsay, and their children and assorted guests who are on holiday on the Isle of Skye. From the seemingly trivial postponement of a visit to a nearby lighthouse, Virginia Woolf constructs a moving examination of the complex tensions and allegiances of family life and the conflicts within a marriage.	\N
21	9780606237802	Catch-22 	Joseph Heller	unknown	2011-01-01 00:00:00	\N	Presents the contemporary classic depicting the struggles of a United States airman attempting to survive the lunacy and depravity of a World War II airbase.	\N
22	0679600175	The Sound and the Fury	William Faulkner	Modern Library 100 Best Novels	1992-01-01 00:00:00	\N	Depicts the troubled childhood of Jason, Quentin, Caddy, and Benjy Compson, members of a southern family.	\N
23	1849433496	Nineteen Eighty Four	George Orwell	Oberon Books	2012-06-21 00:00:00	\N	War is Peace. Freedom is Slavery. Ignorance is Strength. Winston Smith rewrites history for the Ministry of Truth, but when he’s handed a note that says simply ‘I love you’ by a woman he hardly knows, he decides to risk everything in a search for the real truth. In a world where cheap entertainment keeps the proles ignorant but content, where a war without end is always fought and the government is always watching, can Winston possibly hold onto what he feels inside? Or will he renounce everything, accept the Party’s reality and learn to love Big Brother? ‘Dunster – both in his faithful take on the story and in his sometimes extreme but always enthralling adaptation – gets close to the heart of Orwell’s warning, pointing up but not overemphasising its current political resonances.... Newspeak, Doublethink, Room 101 and Thought Police take on a chilling reality in this compelling production.’ – The Independent	\N
24	0198748841	Anna Karenina	Leo Tolstoy	Oxford University Press	2016-01-01 00:00:00	\N	'Love...it means too much to me, far more than you can understand.' Anna Karenina is a beautiful and intelligent woman, whose passionate love for a handsome officer sweeps aside all other ties - to her marriage and to the network of relationships and moral values that bind the society around her. Her love affair with Vronsky is played out alongside the developing romance between Kitty and Levin, and in the character of Levin, closely based on Tolstoy himself, the search for happiness takes on a deeper philosophical significance. One of the greatest novels ever written, Anna Karenina combines penetrating psychological insight with an encyclopedic depiction of Russian life in the 1870s. From high society St Petersburg to the threshing fields on Levin's estate, the novel's intricate labyrinth of connections is deeply involving. Rosamund Bartlett's new translation conveys Tolstoy's precision of meaning and emotional accuracy in an English version that is vivid, nuanced, and compelling. ABOUT THE SERIES: For over 100 years Oxford World's Classics has made available the widest range of literature from around the globe. Each affordable volume reflects Oxford's commitment to scholarship, providing the most accurate text plus a wealth of other valuable features, including expert introductions by leading authorities, helpful notes to clarify the text, up-to-date bibliographies for further study, and much more.	\N
25	0199536791	The Iliad	Homer	Oxford Paperbacks	2008-07-10 00:00:00	\N	The Iliad is the story of a few days' fighting in the tenth year of the legendary war between the Greeks and the Trojans, which broke out when Paris, son of King Priam of Troy, abducted the fabulously beautiful Helen, wife of King Menelaus of Sparta. After a quarrel between the Greek commander, Agamemnon, and the greatest of the Greek warriors, Achilles, the gods become more closely involved in the action. Their intervention leads to the tragic death of Hector, the Trojan leader, and to the final defeat of the Trojans. But the Iliad is much more than a series of battle scenes. It is a work of extraordinary pathos and profundity that concerns itself with issues as fundamental as the meaning of life and death. Even the heroic ethic itself - with its emphasis on pride, honour, prowess in battle, and submission to the inexorable will of the gods - is not left unquestioned.	\N
26	3736800835	Heart of Darkness	Joseph Conrad	BookRix	2018-10-16 00:00:00	\N	Heart of Darkness is a short novel by Polish novelist Joseph Conrad, written as a frame narrative, about Charles Marlow's life as an ivory transporter down the Congo River in Central Africa. The river is "a mighty big river, that you could see on the map, resembling an immense snake uncoiled, with its head in the sea, its body at rest curving afar over a vast country, and its tail lost in the depths of the land." In the course of his travel in central Africa, Marlow becomes obsessed with Mr. Kurtz. The story is a complex exploration of the attitudes people hold on what constitutes a barbarian versus a civilized society and the attitudes on colonialism and racism that were part and parcel of European imperialism. Originally published as a three-part serial story, in Blackwood's Magazine, the novella Heart of Darkness has been variously published and translated into many languages. In 1998, the Modern Library ranked Heart of Darkness one of the hundred best novels in English of the twentieth century.	\N
27	9780143039433	The Grapes of Wrath 	John Steinbeck	Penguin	2006-01-01 00:00:00	\N	STEINBECK/GRAPES OF WRATH (BC)	\N
28	0679732764	Invisible Man 	Ralph Ellison	Vintage	1995-01-01 00:00:00	\N	An African-American man's search for success and the American dream leads him out of college to Harlem and a growing sense of personal rejection and social invisibility. Reissue. 30,000 first printing.	\N
29	9780871299208	To Kill a Mockingbird 	Harper Lee	Dramatic Publishing	1970-01-01 00:00:00	\N	Harper Lee's classic novel of a lawyer in the Deep South defending a black man charged with the rape of a white girl. One of the best-loved stories of all time, To Kill a Mockingbird has earned many distinctions since its original publication in 1960. It won the Pulitzer Prize, has been translated into more than forty languages, sold more than thirty million copies worldwide, and been made into an enormously popular movie. Most recently, librarians across the country gave the book the highest of honors by voting it the best novel of the twentieth century.	\N
30	9781853262371	Middlemarch	George Eliot	Wordsworth Editions	1994-01-01 00:00:00	\N	In nineteenth-century England, Dorthea Brooke's wishes to defy social conventions are inhibited by the strict nature of her surroundings.	\N
\.


--
-- Data for Name: bookshelves; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.bookshelves (shelf_id, user_id, nickname, sent_to_user, public_display) FROM stdin;
1	1	Shelf_BookWormMary	f	f
2	2	Shelf_BookLoverBoo1	f	f
3	3	Shelf_ReadReader2	f	f
4	4	Shelf_WriteReadLive3	f	f
5	5	Shelf_Pages4Ever	f	f
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
1	1	11	5	1
2	1	28	1	2
3	1	11	1	3
4	1	1	4	1
5	1	21	3	4
6	1	30	1	1
7	1	17	1	3
8	1	26	1	4
9	1	27	5	2
10	1	3	2	3
11	2	17	1	1
12	2	26	1	1
13	2	7	3	2
14	2	6	1	2
15	2	30	5	3
16	2	27	2	3
17	2	25	5	4
18	2	30	3	1
19	2	7	4	1
20	2	1	5	3
21	3	21	1	3
22	3	9	2	2
23	3	23	2	4
24	3	12	3	4
25	3	3	1	2
26	3	4	4	1
27	3	24	5	4
28	3	14	4	4
29	3	28	4	1
30	3	16	5	2
31	4	10	1	4
32	4	26	4	3
33	4	17	4	3
34	4	14	3	4
35	4	30	2	1
36	4	28	4	4
37	4	18	3	1
38	4	19	4	2
39	4	4	2	1
40	4	20	2	2
41	5	6	3	1
42	5	4	4	1
43	5	22	3	2
44	5	20	5	2
45	5	4	5	2
46	5	29	2	4
47	5	27	2	2
48	5	11	3	3
49	5	4	5	1
50	5	26	1	1
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: vagrant
--

COPY public.users (user_id, user_name, email, password, joined_at, profile_link, text_number, contact_by_email, contact_by_text, share_link, lat, long) FROM stdin;
1	BookWormMary	test@test.com	test	2020-08-14 19:04:55	\N	\N	\N	\N	\N	\N	\N
2	BookLoverBoo1	test1@test.com	test	2020-08-14 19:04:55	\N	\N	\N	\N	\N	\N	\N
3	ReadReader2	test2@test.com	test	2020-08-14 19:04:55	\N	\N	\N	\N	\N	\N	\N
4	WriteReadLive3	test3@test.com	test	2020-08-14 19:04:55	\N	\N	\N	\N	\N	\N	\N
5	Pages4Ever	test4@test.com	test	2020-08-14 19:04:55	\N	\N	\N	\N	\N	\N	\N
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

