--
-- PostgreSQL database dump
--

\restrict ZybHBTwD1jpwjVuLuvTYrCvv4nCgq2JVq012o9BtdYSxlYUmaWMra0t9Lm6YrpM

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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

ALTER TABLE IF EXISTS ONLY public.skills DROP CONSTRAINT IF EXISTS skills_pkey;
ALTER TABLE IF EXISTS ONLY public.site_settings DROP CONSTRAINT IF EXISTS site_settings_pkey;
ALTER TABLE IF EXISTS ONLY public.projects DROP CONSTRAINT IF EXISTS projects_pkey;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_slug_unique;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_pkey;
ALTER TABLE IF EXISTS public.skills ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.site_settings ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.projects ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.posts ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.skills_id_seq;
DROP TABLE IF EXISTS public.skills;
DROP SEQUENCE IF EXISTS public.site_settings_id_seq;
DROP TABLE IF EXISTS public.site_settings;
DROP SEQUENCE IF EXISTS public.projects_id_seq;
DROP TABLE IF EXISTS public.projects;
DROP SEQUENCE IF EXISTS public.posts_id_seq;
DROP TABLE IF EXISTS public.posts;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text NOT NULL,
    cover_image text,
    published boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title text NOT NULL,
    client text NOT NULL,
    subtitle text NOT NULL,
    role text NOT NULL,
    focus text NOT NULL,
    tools text NOT NULL,
    cover_image text,
    hero_image text,
    description text,
    methodology_steps jsonb DEFAULT '[]'::jsonb NOT NULL,
    gallery_images jsonb DEFAULT '[]'::jsonb NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    published boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    outcomes text,
    highlight_stats jsonb DEFAULT '[]'::jsonb NOT NULL,
    plans jsonb DEFAULT '[]'::jsonb NOT NULL,
    category text DEFAULT ''::text NOT NULL
);


--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: site_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_settings (
    id integer NOT NULL,
    owner_name text DEFAULT 'Uyen Ton'::text NOT NULL,
    title text DEFAULT 'Architectural Technologist'::text NOT NULL,
    subtitle text DEFAULT 'Sheridan College High Honours graduate specializing in technical drawing, 3D modeling, and strict Ontario Building Code compliance.'::text NOT NULL,
    hero_image text,
    about_heading text DEFAULT 'Translating complex architectural concepts into highly precise construction documents.'::text NOT NULL,
    about_body text DEFAULT 'My process prioritizes seamless workflows—from initial site measurements to detailed CAD drafting—ensuring full compliance with zoning by-laws and sustainable LEED standards.'::text NOT NULL,
    info_items jsonb DEFAULT '["BASED IN TORONTO, ON", "AVAILABLE FOR HIRE", "OBC & LEED COMPLIANT"]'::jsonb NOT NULL,
    location text DEFAULT 'Toronto, Ontario'::text NOT NULL,
    email text DEFAULT 'uyenton285@gmail.com'::text NOT NULL,
    phone text DEFAULT '647-713-4229'::text NOT NULL,
    linkedin text DEFAULT 'https://www.linkedin.com/in/uyentonarch/'::text NOT NULL,
    archive_date_range text DEFAULT '2019 — Present'::text NOT NULL,
    admin_password_hash text,
    primary_color text DEFAULT '#C0392B'::text NOT NULL,
    accent_color text DEFAULT '#2D2D2D'::text NOT NULL
);


--
-- Name: site_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.site_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: site_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.site_settings_id_seq OWNED BY public.site_settings.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL
);


--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: site_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings ALTER COLUMN id SET DEFAULT nextval('public.site_settings_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts (id, title, slug, excerpt, content, cover_image, published, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.projects (id, title, client, subtitle, role, focus, tools, cover_image, hero_image, description, methodology_steps, gallery_images, sort_order, published, created_at, outcomes, highlight_stats, plans, category) FROM stdin;
2	Millwork & Cabinetry Drafting	IQ Fine Cabinetry	2D/3D Residential Modeling	Technical Designer	Millwork & Cabinetry	AutoCAD, SketchUp, V-ray	https://images.unsplash.com/photo-1556910103-1c02745a872f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	https://images.unsplash.com/photo-1556910103-1c02745a872f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80	Precision millwork and cabinetry drafting for residential interiors, combining technical accuracy with aesthetic vision.	[{"title": "Technical Detailing", "description": "Designing precise 2D drawings and 3D models for interior elements, specifically cabinetry and complex millwork for residential and commercial spaces."}, {"title": "Material Selection", "description": "Assisting with material selection and technical specifications to ensure optimal quality."}]	["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]	2	t	2026-05-02 12:42:13.929775	\N	[]	[]	
3	Commercial & Residential Layouts	Dinh Design	OBC & LEED Standard Compliance	Architectural Technologist	OBC & LEED Compliance	AutoCAD, Revit, Photoshop	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80	Commercial and residential layout design ensuring full OBC and LEED standards compliance across multiple project types.	[{"title": "OBC & Zoning Compliance", "description": "Interpreting and strictly applying the Ontario Building Code and local zoning by-laws to produce fully compliant layouts."}, {"title": "3D Visualization", "description": "Creating highly detailed 3D renderings and visualizations to enhance client engagement."}]	["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]	3	t	2026-05-02 12:42:16.50018	\N	[]	[]	
4	Sustainable Building Forms	HUIS Design	Site-Responsive Topography Layouts	Architectural Designer	Sustainable Design	SketchUp, Lumion, AutoCAD	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80	Site-responsive sustainable building forms that integrate topography analysis with LEED-aligned design principles.	[{"title": "Site Assessment & Context", "description": "Developing site-responsive layouts considering topography, solar orientation, and wind patterns for sustainable design."}, {"title": "3D Visualization & Delivery", "description": "Creating detailed 3D renderings using SketchUp and Lumion."}]	["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"]	4	t	2026-05-02 12:42:17.731542	\N	[]	[]	
1	Schematic Design & Permitting	Lloyd Hunt Architect	Planning & CAD Development	Architectural Designer	Compliance & Rendering	AutoCAD, SketchUp, Lumion	https://images.unsplash.com/photo-1582063289852-62e3ba2747f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80	https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80	Comprehensive schematic design and permitting work for commercial residential projects, managing full compliance with Ontario Building Code.	[{"title": "Site Assessment & Context", "description": "Conducting rigorous site measurements and inspections prior to and post-construction. Developing site-responsive layouts considering topography, solar orientation, and local wind patterns."}, {"title": "Schematic & Design Development", "description": "Drafting and modifying detailed schematic drawing packages using AutoCAD and Revit."}, {"title": "OBC & Zoning Compliance", "description": "Interpreting and strictly applying the Ontario Building Code and local zoning by-laws."}]	["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", "/api/storage/public-objects/1777728140404-was8044nkbd.png"]	1	t	2026-05-02 12:42:12.458438	\N	[]	[]	
\.


--
-- Data for Name: site_settings; Type: TABLE DATA; Schema: public; Owner: -
--
-- NOTE: admin_password_hash intentionally omitted (\N). After import, set ADMIN_PASSWORD
-- in your environment (or change password in Admin → Settings) so a new hash is created.
--

COPY public.site_settings (id, owner_name, title, subtitle, hero_image, about_heading, about_body, info_items, location, email, phone, linkedin, archive_date_range, admin_password_hash, primary_color, accent_color) FROM stdin;
1	Uyen Ton	Architectural Technologist	Sheridan College High Honours graduate specializing in technical drawing, 3D modeling, and strict Ontario Building Code compliance.	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80	Translating complex architectural concepts into highly precise construction documents.	My process prioritizes seamless workflows—from initial site measurements to detailed CAD drafting—ensuring full compliance with zoning by-laws and sustainable LEED standards. I bring spaces to life through accurate technical specifications and immersive 3D visualizations.	["BASED IN TORONTO, ON", "AVAILABLE FOR HIRE", "OBC & LEED COMPLIANT"]	Toronto, Ontario	uyenton285@gmail.com	647-713-4229	https://www.linkedin.com/in/uyentonarch/	2019 — Present	\N	#0033A0	#FF4A22
\.


--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.skills (id, name, sort_order) FROM stdin;
1	AutoCAD	1
2	Revit	2
3	SketchUp	3
4	Lumion	4
5	V-ray	5
6	OBC Compliance	6
7	Site Planning	7
8	Photoshop	8
\.


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.posts_id_seq', 1, false);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.projects_id_seq', 4, true);


--
-- Name: site_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.site_settings_id_seq', 1, true);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.skills_id_seq', 8, true);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: posts posts_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_slug_unique UNIQUE (slug);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: site_settings site_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_settings
    ADD CONSTRAINT site_settings_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

\unrestrict ZybHBTwD1jpwjVuLuvTYrCvv4nCgq2JVq012o9BtdYSxlYUmaWMra0t9Lm6YrpM

