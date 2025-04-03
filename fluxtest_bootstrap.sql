--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.17 (Ubuntu 14.17-0ubuntu0.22.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ApiKey; Type: TABLE; Schema: public; Owner: postgres

--

CREATE TABLE public."ApiKey" (
    id uuid NOT NULL,
    hashed_key character varying(255) NOT NULL,
    description character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ApiKey" OWNER TO postgres
;

--
-- Name: Image; Type: TABLE; Schema: public; Owner: postgres

--

CREATE TABLE public."Image" (
    id uuid NOT NULL,
    url character varying(255),
    "styleId" integer,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Image" OWNER TO postgres
;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres

--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres
;

--
-- Name: Style; Type: TABLE; Schema: public; Owner: postgres

--

CREATE TABLE public."Style" (
    id uuid NOT NULL,
    "styleId" integer,
    name character varying(255),
    prompt character varying(255),
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Style" OWNER TO postgres
;

--
-- Data for Name: ApiKey; Type: TABLE DATA; Schema: public; Owner: postgres

--

COPY public."ApiKey" (id, hashed_key, description, "createdAt", "updatedAt") FROM stdin;
4d7babfa-55ff-4dc7-86a0-180be45315f4	$2a$10$BdE2AFAS0QReskpshVdM4ORVXeqQoKV.RwM8SkSoQgbN/s8BuMLTe	\N	2025-04-02 20:09:20.35+00	2025-04-02 20:09:20.35+00
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: postgres

--

COPY public."Image" (id, url, "styleId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres

--

COPY public."SequelizeMeta" (name) FROM stdin;
create-image.js
create-style.js
create-api-key.js
\.


--
-- Data for Name: Style; Type: TABLE DATA; Schema: public; Owner: postgres

--

COPY public."Style" (id, "styleId", name, prompt, "createdAt", "updatedAt") FROM stdin;
55b25777-b31d-4b1a-a10b-5beb8bc6c2ae	1	art deco	the art deco style of art by William Morris, art nouveau.	2025-04-02 02:29:21.571+00	2025-04-02 02:29:21.571+00
dc897f08-d628-4b6f-8920-72b9024f47c6	2	collage	paper collage style of Hannah Hoch, Kurt Schwitters, and Man Ray	2025-04-02 02:29:21.576+00	2025-04-02 02:29:21.576+00
dbe474db-c3be-48d4-979d-f04558d29064	3	graffiti	style of graffiti street art, neo-expressionalism.	2025-04-02 02:29:21.578+00	2025-04-02 02:29:21.578+00
8278642a-4ed7-43e8-a7da-8d33677ade93	4	kstyleIdult	the kstyleIdult style of cute drawings done by a preschooler	2025-04-02 02:29:21.58+00	2025-04-02 02:29:21.58+00
726699cd-f2e6-419c-89da-5599411cfa00	5	linocut	the linocut style of minimalistic stylised line work	2025-04-02 02:29:21.581+00	2025-04-02 02:29:21.581+00
44385783-c0ae-44a1-a081-ff818ceef1db	6	retro sepia	retro sepia style of Charles Willson Peale.	2025-04-02 02:29:21.583+00	2025-04-02 02:29:21.583+00
ec326079-af8f-4004-8e80-681897370cf3	7	origami	origami style of Greg Rutkowski	2025-04-02 02:29:21.584+00	2025-04-02 02:29:21.584+00
70819283-c331-4c8c-82e5-fbad42c7dea7	8	risograph	risograph / grain print effect style	2025-04-02 02:29:21.585+00	2025-04-02 02:29:21.585+00
7e84b410-ce4e-4713-a748-7a4e90efd373	9	sculpted	sculpted, polygonal style	2025-04-02 02:29:21.586+00	2025-04-02 02:29:21.586+00
633ad6e6-5bfe-431b-a695-2259fc84629c	10	vintage	the vintage American poster style of Roger Broders, Otto Baumberger, Percy Trompf, Gert Sellheim.	2025-04-02 02:29:21.588+00	2025-04-02 02:29:21.588+00
\.


--
-- Name: ApiKey ApiKey_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."ApiKey"
    ADD CONSTRAINT "ApiKey_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Style Style_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres

--

ALTER TABLE ONLY public."Style"
    ADD CONSTRAINT "Style_pkey" PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

