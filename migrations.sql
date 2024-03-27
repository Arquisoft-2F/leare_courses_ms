--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

DROP DATABASE leare_courses_db;
--
-- Name: leare_courses_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE leare_courses_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';


ALTER DATABASE leare_courses_db OWNER TO postgres;

\connect leare_courses_db

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
-- Name: category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.category (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    category_name text NOT NULL
);


ALTER TABLE public.category OWNER TO postgres;

--
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    course_id uuid DEFAULT gen_random_uuid() NOT NULL,
    course_name text NOT NULL,
    course_description text,
    creator_id uuid NOT NULL,
    public boolean NOT NULL,
    picture_id uuid,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date
);


ALTER TABLE public.course OWNER TO postgres;

--
-- Name: course_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_category (
    course_id uuid,
    category_id uuid
);


ALTER TABLE public.course_category OWNER TO postgres;

--
-- Name: module; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.module (
    module_id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_name text,
    course_id uuid,
    pos_index integer NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date
);


ALTER TABLE public.module OWNER TO postgres;

--
-- Name: section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.section (
    section_id uuid DEFAULT gen_random_uuid() NOT NULL,
    module_id uuid,
    section_name text NOT NULL,
    section_content text,
    video_id uuid,
    files_array text[],
    pos_index integer NOT NULL,
    created_at date DEFAULT CURRENT_DATE NOT NULL,
    updated_at date
);


ALTER TABLE public.section OWNER TO postgres;

--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.category (category_id, category_name) FROM stdin;
d72a2e6e-2784-4e99-a8b7-e3fb88449349	Artes
cacfa60d-7ff5-46be-b0f4-a71c1dadef66	Matematicas
64a10a46-ded4-4ef5-bc01-acf8e76b33a8	Ciencias
d0283a4c-b743-4982-a64f-8cc6d5530b56	Cocina
b09e6f86-9ec6-4933-992d-8967c326f2b3	Actualidad
69ff7be7-ee26-49b0-a670-649e51f88e72	Politica
3d5d518a-9676-4e8d-8ea6-7353e904d3b9	Diseño
6220d46d-a1e3-4e36-b1fb-ec390ced9d18	Ciberseguridad
d778646d-bf38-4677-bb77-da791deb2b9c	Entretenimiento
\.


--
-- Data for Name: course; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course (course_id, course_name, course_description, creator_id, public, picture_id, created_at, updated_at) FROM stdin;
e527c610-27f5-4144-9aae-79224b6f3de5	Curso edicion de curso	Descripcion prueba editada	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-06	2024-03-06
b1e066b4-d2b1-461b-a54e-a24743df438c	Tercer curso editado	Descripcion editada por cuarta vez	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-06	2024-03-09
48cefaff-fcd8-46b4-a85b-30d2854998ea	Ingenieria de software curso editado	Asignatura de ingenieria de software editada	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-07	2024-03-10
bac3dd8d-9dcb-49d2-ac79-2272c3765869	Curso prueba 6 editado otra vez	Descripcion prueba editada otra vez	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-06	2024-03-11
e66ecf38-1a96-43db-aaaa-c52ee7030c64	Metodos numericos	Descripcion metodos	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-11	2024-03-11
16be6c88-58c6-4df6-9c03-1809e1734b5d	Teoría de la información	Descripcion teoinfo	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-11	2024-03-11
d72aa1f5-d20e-48a2-9e52-935da05ebd1b	Demo	Demostracion	fc820271-d767-4b7e-98a7-160264f9beee	f	b8845360-2881-40a5-b818-bb7559e549ad	2024-03-12	2024-03-12
\.


--
-- Data for Name: course_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_category (course_id, category_id) FROM stdin;
e527c610-27f5-4144-9aae-79224b6f3de5	d72a2e6e-2784-4e99-a8b7-e3fb88449349
e527c610-27f5-4144-9aae-79224b6f3de5	64a10a46-ded4-4ef5-bc01-acf8e76b33a8
b1e066b4-d2b1-461b-a54e-a24743df438c	d72a2e6e-2784-4e99-a8b7-e3fb88449349
bac3dd8d-9dcb-49d2-ac79-2272c3765869	64a10a46-ded4-4ef5-bc01-acf8e76b33a8
bac3dd8d-9dcb-49d2-ac79-2272c3765869	d778646d-bf38-4677-bb77-da791deb2b9c
e66ecf38-1a96-43db-aaaa-c52ee7030c64	cacfa60d-7ff5-46be-b0f4-a71c1dadef66
e66ecf38-1a96-43db-aaaa-c52ee7030c64	64a10a46-ded4-4ef5-bc01-acf8e76b33a8
16be6c88-58c6-4df6-9c03-1809e1734b5d	3d5d518a-9676-4e8d-8ea6-7353e904d3b9
16be6c88-58c6-4df6-9c03-1809e1734b5d	cacfa60d-7ff5-46be-b0f4-a71c1dadef66
48cefaff-fcd8-46b4-a85b-30d2854998ea	6220d46d-a1e3-4e36-b1fb-ec390ced9d18
48cefaff-fcd8-46b4-a85b-30d2854998ea	3d5d518a-9676-4e8d-8ea6-7353e904d3b9
d72aa1f5-d20e-48a2-9e52-935da05ebd1b	cacfa60d-7ff5-46be-b0f4-a71c1dadef66
d72aa1f5-d20e-48a2-9e52-935da05ebd1b	64a10a46-ded4-4ef5-bc01-acf8e76b33a8
\.


--
-- Data for Name: module; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.module (module_id, module_name, course_id, pos_index, created_at, updated_at) FROM stdin;
b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Modulo editado 2	b1e066b4-d2b1-461b-a54e-a24743df438c	10	2024-03-07	2024-03-07
d7a06e0c-1f4d-4efe-ae09-638521ffd11a	Modulo en docker	48cefaff-fcd8-46b4-a85b-30d2854998ea	1	2024-03-09	2024-03-09
7b74ccb7-23e5-4a79-b1c2-424623173820	Primer modulo para ingenieria de software editado	48cefaff-fcd8-46b4-a85b-30d2854998ea	2	2024-03-07	2024-03-10
8bd108bb-5fce-45e9-91e3-f75b8303146a	Modulo MN 1	d72aa1f5-d20e-48a2-9e52-935da05ebd1b	1	2024-03-12	2024-03-12
77966309-6f22-46a0-8db1-820692f2f7f5	Modulo MN 2	d72aa1f5-d20e-48a2-9e52-935da05ebd1b	2	2024-03-12	2024-03-12
\.


--
-- Data for Name: section; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.section (section_id, module_id, section_name, section_content, video_id, files_array, pos_index, created_at, updated_at) FROM stdin;
ae936fe6-b2ac-4783-a91b-11a5c734a05f	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 2	Contenido de prueba 2	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	1	2024-03-07	2024-03-07
8a2c19df-0ecb-4a12-ac15-6203e6d371d4	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 3	Contenido de prueba 3	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	2	2024-03-07	2024-03-07
29c94367-47f7-4b0c-bc8f-91fcf66d71fb	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 4	Contenido de prueba 4	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	3	2024-03-07	2024-03-07
6d7df2fc-96e4-44ed-8944-0efd5d1e7da9	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 5	Contenido de prueba 5	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	4	2024-03-07	2024-03-07
c5041d12-448c-430d-931f-3e52a6e3d1a8	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 6	Contenido de prueba 6	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	5	2024-03-07	2024-03-07
dce7028d-632c-4b0e-99ac-35f591ccea25	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 7	Contenido de prueba 7	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	6	2024-03-07	2024-03-07
fca69532-7622-4c04-a1e2-d741d5ee103a	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 8	Contenido de prueba 8	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	7	2024-03-07	2024-03-07
9fe55a36-c606-4f6f-872b-a8a5eb0cd172	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 9	Contenido de prueba 9	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	8	2024-03-07	2024-03-07
07a9b53d-0be4-4977-b1bc-00bcf3daf8f0	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 10	Contenido de prueba 10	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	9	2024-03-07	2024-03-07
6dd83a6c-cc64-4063-afda-5150c257a02b	b25e77dc-f7b1-497d-b46a-e5d5138eaaf6	Seccion de prueba 11	Contenido de prueba 11	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	10	2024-03-07	2024-03-07
34f572e9-b1c3-4a55-be8c-41b770760a25	7b74ccb7-23e5-4a79-b1c2-424623173820	Seccion de prueba 12 editada 3	Contenido de prueba 12 editada 3	3b8d4b34-3683-42c5-bec7-57fdc5c62800	{502ea11b-bc24-4455-b27b-95fdb2aaa961,9601e4c7-598f-48d4-a8cf-036d0ca48946,6762818b-7e76-4e4c-bb09-ef4bf0b624ab}	11	2024-03-07	2024-03-07
\.


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (category_id);


--
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (course_id);


--
-- Name: module module_course_id_pos_index_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_course_id_pos_index_key UNIQUE (course_id, pos_index);


--
-- Name: module module_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_pkey PRIMARY KEY (module_id);


--
-- Name: section section_module_id_pos_index_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_module_id_pos_index_key UNIQUE (module_id, pos_index);


--
-- Name: section section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_pkey PRIMARY KEY (section_id);


--
-- Name: course_category course_category_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category
    ADD CONSTRAINT course_category_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.category(category_id);


--
-- Name: course_category course_category_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_category
    ADD CONSTRAINT course_category_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id);


--
-- Name: section fk_module_section; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT fk_module_section FOREIGN KEY (module_id) REFERENCES public.module(module_id) ON DELETE CASCADE;


--
-- Name: module module_course_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.module
    ADD CONSTRAINT module_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.course(course_id);


--
-- Name: section section_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.section
    ADD CONSTRAINT section_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.module(module_id);


--
-- PostgreSQL database dump complete
--

