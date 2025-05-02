SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8
-- Dumped by pg_dump version 15.8

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	e90d32ef-ebcb-4bb0-87f8-e44be06f583b	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"vl4d1m1r4@gmail.com","user_id":"b857b163-5984-4f68-bb78-f1737e7c5938","user_phone":""}}	2025-03-28 14:10:55.501987+00	
00000000-0000-0000-0000-000000000000	6aa04879-a198-4983-a714-a363af61f171	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-28 14:36:41.035084+00	
00000000-0000-0000-0000-000000000000	244a9730-e9ba-4f90-afaf-18e6c849493a	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-03-28 15:17:17.521354+00	
00000000-0000-0000-0000-000000000000	1ce4c9a7-90c3-413a-9765-d86a291b6d5d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 15:57:55.315633+00	
00000000-0000-0000-0000-000000000000	ab572409-daa9-4c49-873b-50efa3781b51	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 15:57:55.316666+00	
00000000-0000-0000-0000-000000000000	40cdb2dd-7957-431f-bacd-f4b5dc94d604	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 15:57:55.337187+00	
00000000-0000-0000-0000-000000000000	204085ae-93b9-44e1-bafd-232d93956089	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 15:57:56.564116+00	
00000000-0000-0000-0000-000000000000	7be12646-b631-46ca-938e-40ca6ba9b300	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 15:57:57.878886+00	
00000000-0000-0000-0000-000000000000	02b2211f-43c0-4050-8b66-179ac6950a61	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 22:09:10.785418+00	
00000000-0000-0000-0000-000000000000	a4cadbcc-3d91-4fef-86c5-42cde5a757e0	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 22:09:10.786421+00	
00000000-0000-0000-0000-000000000000	459fda54-d19b-4491-9e5a-2f77462e7bf0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 23:12:16.936475+00	
00000000-0000-0000-0000-000000000000	413075fa-19cc-4ee5-8d05-eb9d57907b62	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 23:12:16.939649+00	
00000000-0000-0000-0000-000000000000	442dcac0-651d-4b39-8bb1-4d118c1d481c	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 23:12:17.29968+00	
00000000-0000-0000-0000-000000000000	a04a668f-68a0-4a72-917a-1e80f6283664	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 23:12:17.664337+00	
00000000-0000-0000-0000-000000000000	f69132b8-0ce5-4f4e-a540-a5f6a6d9d887	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-28 23:12:18.03473+00	
00000000-0000-0000-0000-000000000000	c27b896e-2981-450f-8ff1-3baa83768a6d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-31 20:03:30.853569+00	
00000000-0000-0000-0000-000000000000	bd68a1e5-fcaa-4160-97bd-968b5cfb7a82	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-03-31 20:03:30.878907+00	
00000000-0000-0000-0000-000000000000	00534666-f45b-4048-9f22-72e6f6da0ec4	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-01 16:44:05.106513+00	
00000000-0000-0000-0000-000000000000	7191bf63-d343-48ac-b128-5c9cd0a1b856	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-01 16:44:05.119224+00	
00000000-0000-0000-0000-000000000000	11744f7f-9987-423d-b664-6cb494d60ca4	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-01 18:23:42.452242+00	
00000000-0000-0000-0000-000000000000	fc1aa19d-b7bb-4036-bf90-f4e8b0f1b35f	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-01 18:23:42.453989+00	
00000000-0000-0000-0000-000000000000	35c3b3ad-56d7-4e87-8675-669658cef5b7	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-01 18:23:42.832376+00	
00000000-0000-0000-0000-000000000000	11e17c49-a4a9-4e40-b96a-a78aba76a291	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 07:38:05.224141+00	
00000000-0000-0000-0000-000000000000	250d260d-6a71-42e0-91b8-3537e8248eb6	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 07:38:05.242971+00	
00000000-0000-0000-0000-000000000000	7066d8f6-4413-44ce-931c-22741b9e2935	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 07:38:05.286737+00	
00000000-0000-0000-0000-000000000000	01751740-7935-40e1-b759-cb5b1c2392ab	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 07:38:05.321846+00	
00000000-0000-0000-0000-000000000000	eb87dd6f-0602-4d8d-b3f2-7cf4aeda9488	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 07:38:06.601936+00	
00000000-0000-0000-0000-000000000000	1025ea6d-50b4-4fce-a3e8-5fbac38f67ef	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 14:45:16.897915+00	
00000000-0000-0000-0000-000000000000	7fab9810-2606-4c19-8256-3917b46de8db	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 14:45:16.909014+00	
00000000-0000-0000-0000-000000000000	ad0f2675-5156-4a11-846f-2f468f032aad	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:23.478532+00	
00000000-0000-0000-0000-000000000000	b906f9b0-d224-4ad4-aebb-c2d8a2c0e4e3	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:23.484697+00	
00000000-0000-0000-0000-000000000000	a3614f23-3992-4084-8b56-f19854e78fe9	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:23.514612+00	
00000000-0000-0000-0000-000000000000	ddbca8aa-fcea-43b8-8885-8d5e9f9ffeef	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:23.528568+00	
00000000-0000-0000-0000-000000000000	9150393e-6dca-4872-adad-1dbcc1af9972	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:23.944525+00	
00000000-0000-0000-0000-000000000000	16bf8257-afc1-4040-bbbf-f185931ffd5b	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:24.350446+00	
00000000-0000-0000-0000-000000000000	baa6bc72-11ed-498d-a875-656db53ca8ba	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-02 20:41:24.732316+00	
00000000-0000-0000-0000-000000000000	5e5034a7-3fec-47aa-b00c-cab69198be3d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:29.06737+00	
00000000-0000-0000-0000-000000000000	ea4d8892-c071-4c7f-b73d-215159c9a819	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:29.086009+00	
00000000-0000-0000-0000-000000000000	c997fb9c-9970-48cc-86e1-163eb3132c2d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:29.134638+00	
00000000-0000-0000-0000-000000000000	25cffb8a-190c-4de4-b4ea-d1783f897258	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:29.165217+00	
00000000-0000-0000-0000-000000000000	4f4c5f9a-1017-4eed-8f00-39d0fd869231	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:29.891995+00	
00000000-0000-0000-0000-000000000000	eec4fbf2-c5f0-4197-8203-5fbc422b27cc	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:30.807391+00	
00000000-0000-0000-0000-000000000000	3b1b5be2-749d-488b-bee6-8c78f1558fd5	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 07:55:31.689358+00	
00000000-0000-0000-0000-000000000000	776f0c0c-a831-4787-9b62-b7bb3012a200	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 08:57:08.472946+00	
00000000-0000-0000-0000-000000000000	d208f5e3-11b4-4349-9b62-c031441fdd19	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 08:57:08.473957+00	
00000000-0000-0000-0000-000000000000	962dbc45-3241-4833-9454-dcbdf1488ce8	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-03 09:22:57.587656+00	
00000000-0000-0000-0000-000000000000	2c0593f1-7b46-4e4c-bd3a-1e047e010491	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:58:31.528282+00	
00000000-0000-0000-0000-000000000000	11bec3be-1f92-4b0b-a95e-46080eee27ab	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:58:31.53002+00	
00000000-0000-0000-0000-000000000000	67073e0a-5a2f-417d-9e8c-003595bb300e	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:58:31.659691+00	
00000000-0000-0000-0000-000000000000	f5ff7e21-78b4-4381-8ccf-1af074393d3d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:58:32.810813+00	
00000000-0000-0000-0000-000000000000	561bb14c-6949-4e8a-8e97-9c09ffaea0ce	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:58:34.15764+00	
00000000-0000-0000-0000-000000000000	be72d831-851a-4eee-8306-5c8e703885c0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 09:58:35.499643+00	
00000000-0000-0000-0000-000000000000	576e114e-f73c-4196-880e-bcb195f64210	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:41.277662+00	
00000000-0000-0000-0000-000000000000	236956c2-751d-44ed-a060-eb9cc05cc483	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:41.279461+00	
00000000-0000-0000-0000-000000000000	b3ae65ab-47aa-4bde-90fa-e72d90697004	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:41.380979+00	
00000000-0000-0000-0000-000000000000	db150e8b-cded-47ae-8105-d66bdacca710	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:41.513278+00	
00000000-0000-0000-0000-000000000000	47cb9d44-1565-42ad-b95f-c6b7d994dbd0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:42.562775+00	
00000000-0000-0000-0000-000000000000	3d725ed5-f0aa-41ec-98be-bc4b76e15926	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:42.718974+00	
00000000-0000-0000-0000-000000000000	33558324-6a86-4ef6-b5f0-c7d3d0edf99a	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:43.836955+00	
00000000-0000-0000-0000-000000000000	5bd9261d-2a86-492c-a40a-b36beaa6a5c0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:28:44.073116+00	
00000000-0000-0000-0000-000000000000	49891b45-8337-4f92-93fe-010177c837e6	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:35.193157+00	
00000000-0000-0000-0000-000000000000	fab346e7-e257-4816-ac21-98f7f5a6421c	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:35.194908+00	
00000000-0000-0000-0000-000000000000	805d457c-5069-4ef8-b6e7-5bf253aefb91	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:35.229503+00	
00000000-0000-0000-0000-000000000000	b0348153-8c2e-49b4-966f-b4023e5cc35d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:35.287188+00	
00000000-0000-0000-0000-000000000000	a86bdf8e-065d-4bfd-b014-0ff3f73d21f9	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:36.457555+00	
00000000-0000-0000-0000-000000000000	f03b59fc-f5b4-4ee9-96b5-ca9ac0c16215	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:36.467991+00	
00000000-0000-0000-0000-000000000000	2092e20f-1b4f-4519-9085-9507b5aceca0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:37.643136+00	
00000000-0000-0000-0000-000000000000	9797c0a4-cf38-4733-9e1b-a0fc0a9c3245	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 12:31:37.843232+00	
00000000-0000-0000-0000-000000000000	fb3c3d3f-b675-467c-b0f2-6fdff032213d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 13:30:38.218236+00	
00000000-0000-0000-0000-000000000000	a1af4361-a295-4cf4-a9fb-17c587ef2853	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 13:30:38.219863+00	
00000000-0000-0000-0000-000000000000	07223676-685e-45d6-967f-6056ab578541	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:29.948562+00	
00000000-0000-0000-0000-000000000000	65bf7ae9-ed81-4664-b340-5943245d6988	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:29.950426+00	
00000000-0000-0000-0000-000000000000	5a40edb0-2aab-4725-9059-bf5372c2628a	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:30.01923+00	
00000000-0000-0000-0000-000000000000	95882fd2-9727-4dfe-b628-55867bc8ad32	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:30.135633+00	
00000000-0000-0000-0000-000000000000	f946606e-27d5-4efa-a1b7-d8c69c2a1aa1	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:30.518759+00	
00000000-0000-0000-0000-000000000000	2197259b-39b0-404a-93ea-b80d312ef789	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:30.902689+00	
00000000-0000-0000-0000-000000000000	04eb2106-defc-4eaa-b98d-69a178d5d70c	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:13:31.246885+00	
00000000-0000-0000-0000-000000000000	b0a67d86-ddb8-4343-846a-32d1516db666	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:16:06.532892+00	
00000000-0000-0000-0000-000000000000	2f05aeb9-f105-4ec2-ba4f-85759cd9d667	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:16:06.533818+00	
00000000-0000-0000-0000-000000000000	8ea8fbaf-5835-43b5-8eef-f8579a37d694	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:16:06.659863+00	
00000000-0000-0000-0000-000000000000	2c037426-64b4-42e7-b3ca-e183d1e9cf21	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 15:16:06.84052+00	
00000000-0000-0000-0000-000000000000	0f08824e-8cd5-42f8-ad0f-70c5886d74dd	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 16:14:22.886069+00	
00000000-0000-0000-0000-000000000000	ecd85882-0d11-42e3-8666-4f99ecd2fac1	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 16:14:22.888737+00	
00000000-0000-0000-0000-000000000000	18b4a2aa-23c3-4a8e-af5f-2c07d4ce76f6	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 17:14:46.44401+00	
00000000-0000-0000-0000-000000000000	201903e7-4dcc-407f-8ad8-040b7764948a	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-03 17:14:46.446783+00	
00000000-0000-0000-0000-000000000000	0441374a-a9b1-4909-ab33-d8b4c60ad30b	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-03 17:23:30.761006+00	
00000000-0000-0000-0000-000000000000	fd7c2c73-6aee-465c-ba4e-b80b5211e0a6	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kkmladost97@yahoo.com","user_id":"908cdd5c-0482-4644-a899-e6ca818d39ef","user_phone":""}}	2025-04-03 18:05:24.343024+00	
00000000-0000-0000-0000-000000000000	f644c673-e30b-46da-a9cb-4e8cffb733a5	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kkmladost97@yahoo.com","user_id":"908cdd5c-0482-4644-a899-e6ca818d39ef","user_phone":""}}	2025-04-03 18:06:56.643706+00	
00000000-0000-0000-0000-000000000000	54b13597-1731-49bd-bb86-e68d125343fb	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"kkmladost97@yahoo.com","user_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","user_phone":""}}	2025-04-03 18:07:10.434299+00	
00000000-0000-0000-0000-000000000000	cb79f55c-83e2-46b4-b6e1-92c5ee20d5bb	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-03 18:07:24.724742+00	
00000000-0000-0000-0000-000000000000	48d4158e-4632-4b55-b444-18c74985ac55	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-03 18:08:46.228935+00	
00000000-0000-0000-0000-000000000000	2557fca8-7853-4e47-a8f9-e08b472cd53e	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-03 18:22:38.579374+00	
00000000-0000-0000-0000-000000000000	fed4b494-c5cb-4fe3-83cc-e22d72344bb4	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 00:07:38.358857+00	
00000000-0000-0000-0000-000000000000	ce9c6379-123a-4cfd-9fab-bb177a81d586	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 00:07:38.381189+00	
00000000-0000-0000-0000-000000000000	2f4c2778-839d-487c-b77f-d6c7948b3220	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 07:59:27.538851+00	
00000000-0000-0000-0000-000000000000	3e34ebcc-1a69-424f-bd03-3a2a451e188a	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 07:59:27.555634+00	
00000000-0000-0000-0000-000000000000	156f2d5f-bb4e-4d72-a7dc-6357c4104632	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 08:56:05.878156+00	
00000000-0000-0000-0000-000000000000	fe9609b1-f652-42b5-a6ee-2d94e08eb809	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 08:56:05.886984+00	
00000000-0000-0000-0000-000000000000	f5e556ea-2aa6-4c10-866a-1bf2a32ac3b3	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 09:04:49.806517+00	
00000000-0000-0000-0000-000000000000	1f0d2329-4ac5-415a-a669-09876e7e1ee1	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 09:04:49.809924+00	
00000000-0000-0000-0000-000000000000	43ab9546-40ea-43d2-a3d0-2734a6d6b6ab	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 09:05:56.605447+00	
00000000-0000-0000-0000-000000000000	05254f03-721c-45da-9da8-5e17bdc88d56	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 09:05:56.606317+00	
00000000-0000-0000-0000-000000000000	ee15b185-4e73-461f-9b3b-5c5cd6b73da0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 10:04:17.413873+00	
00000000-0000-0000-0000-000000000000	72d45f36-ba63-4814-801c-a46b237eca42	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 10:04:17.415976+00	
00000000-0000-0000-0000-000000000000	f59163ef-c0c8-4868-885c-8b5b804b0645	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 10:21:08.650691+00	
00000000-0000-0000-0000-000000000000	282e0903-acc1-4908-841d-1ae0576efc5f	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 10:21:08.652246+00	
00000000-0000-0000-0000-000000000000	99419e5b-85ab-4d04-a499-8a2c9fe764e3	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 11:05:03.317705+00	
00000000-0000-0000-0000-000000000000	4effe0b5-72a7-438b-8e92-e207e3c9e893	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 11:59:11.908987+00	
00000000-0000-0000-0000-000000000000	57ebf121-7751-4433-9c55-6bc094c7ebba	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 11:59:11.911094+00	
00000000-0000-0000-0000-000000000000	5e158de1-6d75-488a-a352-19249ff22354	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-04-04 12:02:01.087238+00	
00000000-0000-0000-0000-000000000000	f523fa41-d368-4232-a508-6650a45b0ed6	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 12:15:45.216803+00	
00000000-0000-0000-0000-000000000000	d4c962fb-3752-4ec1-b185-2eeaf005af8d	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-04-04 12:16:40.190498+00	
00000000-0000-0000-0000-000000000000	3893d52b-c587-409d-a1da-f2c842594e76	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 12:17:39.981525+00	
00000000-0000-0000-0000-000000000000	6cbea76a-634e-4d32-acce-c13266fd5d0c	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 13:02:05.7454+00	
00000000-0000-0000-0000-000000000000	28e3f4c7-c42f-44fa-ad5d-e3d057d7ccb0	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-04-04 13:03:07.794766+00	
00000000-0000-0000-0000-000000000000	6b85c727-7309-4725-8f5a-5d4578a69630	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 13:03:14.869316+00	
00000000-0000-0000-0000-000000000000	aae090ec-8ebc-4da0-8627-6111c6aaf8ac	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 13:10:24.054266+00	
00000000-0000-0000-0000-000000000000	5edd7bd3-70f7-4d46-b417-25c73736fc56	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 14:41:35.783107+00	
00000000-0000-0000-0000-000000000000	bbdc1d51-3804-4e77-bd94-eb8365eab76b	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 14:41:35.789004+00	
00000000-0000-0000-0000-000000000000	6c7d8500-2775-48ff-a30f-e3b0d211eb54	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-04 14:41:35.826366+00	
00000000-0000-0000-0000-000000000000	f903282c-b1aa-45a1-a75c-6aca24f5cae8	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-04-04 14:42:02.06232+00	
00000000-0000-0000-0000-000000000000	da083a89-a0bd-4f51-8443-7ffb0fc10edf	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 14:42:17.527565+00	
00000000-0000-0000-0000-000000000000	9dca03db-eca2-417d-adee-8980933b19de	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-04 15:21:47.729792+00	
00000000-0000-0000-0000-000000000000	ddae842f-1dcf-41b2-87c6-0ca93ef18027	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"aleksandar@cindrikj.net","user_id":"d7d749ef-dcd8-4577-9833-e2745d6d77dd","user_phone":""}}	2025-04-05 00:58:49.314221+00	
00000000-0000-0000-0000-000000000000	9a92f03d-0335-4b94-8649-1f247579192a	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-06 18:47:51.580313+00	
00000000-0000-0000-0000-000000000000	01a5a64f-d2fa-49d2-9516-6273b040273a	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-06 20:43:16.490965+00	
00000000-0000-0000-0000-000000000000	1858d1ae-3bd2-4886-9ec8-7ab1d8be584d	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-06 20:43:16.505603+00	
00000000-0000-0000-0000-000000000000	c2f49c2b-3073-4df3-a63a-4c42c8ff7085	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-07 11:14:39.296809+00	
00000000-0000-0000-0000-000000000000	0294a54a-1059-4266-95a1-64bead628498	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-07 11:14:39.317621+00	
00000000-0000-0000-0000-000000000000	0b41e452-bd9c-4700-a6c7-cbf8805286ae	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-07 11:14:39.371833+00	
00000000-0000-0000-0000-000000000000	64fc8a03-4a54-4c46-b4cf-d9dc3e92bb9a	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-04-07 11:14:47.218077+00	
00000000-0000-0000-0000-000000000000	e6d60bf1-6528-4e11-94fd-e9806b3e90c4	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-07 11:15:01.26888+00	
00000000-0000-0000-0000-000000000000	c0085866-986e-42ad-b5c9-1f2363af451c	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-04-07 11:44:33.719622+00	
00000000-0000-0000-0000-000000000000	08b6b452-5b2a-4349-88b3-8cbb460da6a9	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-07 15:52:18.181577+00	
00000000-0000-0000-0000-000000000000	c2fc0ad8-e2f6-4a21-8145-f28b54898748	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-07 17:16:08.83163+00	
00000000-0000-0000-0000-000000000000	59ab8f84-e8ae-4c11-baa6-a1e51487c8dc	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-07 17:16:08.8343+00	
00000000-0000-0000-0000-000000000000	79d07314-b435-4d72-a9b8-2d8fd8eb8456	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-09 11:24:19.759541+00	
00000000-0000-0000-0000-000000000000	1b641685-8f3a-4526-9d11-afeb260000dc	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-09 15:05:58.43096+00	
00000000-0000-0000-0000-000000000000	079da7a9-18a8-4477-9a3e-541a2da98223	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-09 15:05:58.437549+00	
00000000-0000-0000-0000-000000000000	e99059f1-31de-43a1-b2ed-a06a802f5b6c	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 11:29:29.888511+00	
00000000-0000-0000-0000-000000000000	74ef832b-e34f-4049-b674-15a70dbfa1f2	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 11:29:29.946966+00	
00000000-0000-0000-0000-000000000000	6764210d-ddad-4e3d-96ee-c614a24ad06f	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 12:42:23.348743+00	
00000000-0000-0000-0000-000000000000	285e09b7-ef4b-4cb4-861d-67cc557d49e4	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 12:42:23.350508+00	
00000000-0000-0000-0000-000000000000	7c62bc46-8e25-4841-bb7a-dd4a2c10a981	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 18:49:53.143796+00	
00000000-0000-0000-0000-000000000000	7d3be037-45f8-4315-a800-7e6fad1048c1	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 18:49:53.146756+00	
00000000-0000-0000-0000-000000000000	8836a704-fb5c-4485-81f0-0cc99a76b108	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-15 18:49:53.167559+00	
00000000-0000-0000-0000-000000000000	463a1ddc-c74c-4ce8-8079-0315123209e3	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-16 07:16:18.214868+00	
00000000-0000-0000-0000-000000000000	c7a048ed-323c-457a-b2f8-c7bd8b7361c1	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-20 14:54:41.231272+00	
00000000-0000-0000-0000-000000000000	ead8a8cc-936d-42ae-8ddc-ed3d8b4acf1a	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-20 14:54:41.251253+00	
00000000-0000-0000-0000-000000000000	52ff11aa-b939-4577-90c9-4e13c986c77f	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-20 14:54:41.319465+00	
00000000-0000-0000-0000-000000000000	6495a427-dd70-436b-8961-1546613f1286	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-20 20:18:35.807714+00	
00000000-0000-0000-0000-000000000000	d2a545a8-638c-46df-9514-28cad52b6d09	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-20 20:18:35.811425+00	
00000000-0000-0000-0000-000000000000	c9692b50-596b-40e8-ac19-02a54385f56a	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-20 20:18:35.830577+00	
00000000-0000-0000-0000-000000000000	6dedc995-add6-4649-8f69-a9f7bc1d9920	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 17:48:33.632319+00	
00000000-0000-0000-0000-000000000000	8c2c54e5-4a10-4064-a2c2-9105a1e85e26	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 17:48:33.65326+00	
00000000-0000-0000-0000-000000000000	021be822-1aa2-4ce1-b0a3-2cb6c3b6d069	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 17:48:33.712876+00	
00000000-0000-0000-0000-000000000000	72631610-5ec1-44d5-b135-787b40c26264	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 19:19:37.285246+00	
00000000-0000-0000-0000-000000000000	fcbf2709-7c43-4ff3-a9fa-73c88c1a7b23	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 19:19:37.287519+00	
00000000-0000-0000-0000-000000000000	f23c956b-ceb7-4e0b-9461-b17dffa56b1a	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 19:19:37.316081+00	
00000000-0000-0000-0000-000000000000	2e439275-f101-4c34-9026-7ed21c4fd812	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 20:04:49.666709+00	
00000000-0000-0000-0000-000000000000	5e247051-5160-4ac3-802e-cc32a3126a27	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 20:04:49.668301+00	
00000000-0000-0000-0000-000000000000	288dff0b-c561-425c-b9fc-c2330cfbc102	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 20:04:49.711826+00	
00000000-0000-0000-0000-000000000000	ecc1fd27-1839-49ae-aeb6-15d02d2d8fde	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 20:35:40.059028+00	
00000000-0000-0000-0000-000000000000	d9f9d80a-0a1a-4ff4-910b-c14de9dcd3dd	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 20:35:40.06297+00	
00000000-0000-0000-0000-000000000000	80031d01-0607-486a-aa0f-e111dd4b1e5d	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-21 20:35:40.087035+00	
00000000-0000-0000-0000-000000000000	43a8a98a-10ab-4af1-88f7-84d2abc3833a	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-22 20:30:41.867751+00	
00000000-0000-0000-0000-000000000000	859c529c-8369-4912-955d-b480f80e2a78	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-22 20:30:41.890016+00	
00000000-0000-0000-0000-000000000000	02f0a71e-7ada-4a58-9b40-9e5df9889f89	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-22 20:30:41.942737+00	
00000000-0000-0000-0000-000000000000	6770ac5f-2f96-47e2-a554-670aaee74d38	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-24 09:32:14.633249+00	
00000000-0000-0000-0000-000000000000	3b37d09f-a9dc-4c42-81a6-23f9c90ddcde	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-24 09:32:14.649476+00	
00000000-0000-0000-0000-000000000000	89b4fd5c-241e-4aac-bae9-f393a5360dee	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-24 09:32:14.70066+00	
00000000-0000-0000-0000-000000000000	a4c4b22c-2ced-4656-9469-27818b17c231	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-24 17:59:31.874941+00	
00000000-0000-0000-0000-000000000000	bc00b4f3-7955-4c0d-98d3-dd13b7ccc41b	{"action":"token_revoked","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-24 17:59:31.897441+00	
00000000-0000-0000-0000-000000000000	3f6eb97f-5830-4831-9875-84cc9e12c5d3	{"action":"token_refreshed","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"token"}	2025-04-24 17:59:31.953794+00	
00000000-0000-0000-0000-000000000000	fe4a18b5-821c-47aa-9230-0a0100fb3c73	{"action":"logout","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account"}	2025-04-24 18:26:49.771281+00	
00000000-0000-0000-0000-000000000000	b071beb0-8ba3-42c7-ad4b-ef863de5d00a	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-25 07:23:08.142291+00	
00000000-0000-0000-0000-000000000000	d487f664-80ba-4594-be04-5b7bcf9b9b7f	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-25 07:23:08.718938+00	
00000000-0000-0000-0000-000000000000	bde4bc27-4d51-428a-a9a7-88d23e1ac5c4	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 14:28:16.612171+00	
00000000-0000-0000-0000-000000000000	fd4971b7-5f41-4323-8664-c8187b2bbae9	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 14:28:16.632086+00	
00000000-0000-0000-0000-000000000000	525700c7-f8f6-4c38-afb1-0ba5040b43e4	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 14:28:16.675682+00	
00000000-0000-0000-0000-000000000000	e3613d69-553c-4b20-ab4a-3f89f0599146	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-25 14:53:44.275814+00	
00000000-0000-0000-0000-000000000000	769747f9-ed3b-4db0-8a0a-a475155f3d2b	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-25 14:53:44.807395+00	
00000000-0000-0000-0000-000000000000	18bb6b04-95a1-4753-8a33-2f40533d520e	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-25 14:53:45.88951+00	
00000000-0000-0000-0000-000000000000	9e9c2f4d-2fc3-44d8-aa6c-3fcc3c4195f3	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 15:26:42.787213+00	
00000000-0000-0000-0000-000000000000	db0321df-2695-461a-95a0-67fdc498e7e5	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 15:26:42.78946+00	
00000000-0000-0000-0000-000000000000	3e6b923f-8d2a-480a-9907-b41033a042a7	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 15:51:58.949376+00	
00000000-0000-0000-0000-000000000000	63bb115a-f061-4e90-8191-b5e76e3ba4d6	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 15:51:58.9526+00	
00000000-0000-0000-0000-000000000000	e7c4f240-e9e2-40a6-889c-e6f8e0202576	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 17:49:53.470478+00	
00000000-0000-0000-0000-000000000000	8d52feb5-7df6-4f26-bd9f-c414d35949f1	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 17:49:53.473299+00	
00000000-0000-0000-0000-000000000000	19404169-66b3-4670-801d-b3caa0d9112c	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 17:49:53.493715+00	
00000000-0000-0000-0000-000000000000	b11394aa-3ff7-41f0-91b1-ab43b23dc485	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 17:56:24.953043+00	
00000000-0000-0000-0000-000000000000	e779e076-5041-4285-b5a9-337908cfba18	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 17:56:24.955112+00	
00000000-0000-0000-0000-000000000000	eafe7df6-166e-4d78-8fbc-70378c7a55e3	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-25 17:56:25.083138+00	
00000000-0000-0000-0000-000000000000	852754d2-702e-4314-a9fd-2541e9106038	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-26 08:24:47.579028+00	
00000000-0000-0000-0000-000000000000	38cfbd05-ad2d-4a65-b36e-bb29e19da1f6	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-26 08:24:47.608357+00	
00000000-0000-0000-0000-000000000000	110c2809-dfe1-4942-b7c0-4fb5c58a9ac7	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-26 08:24:47.661709+00	
00000000-0000-0000-0000-000000000000	2862e127-a596-4afc-9bd3-1eaa6014ff48	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-27 19:49:23.658054+00	
00000000-0000-0000-0000-000000000000	0cda57fa-f058-411c-85cb-022b2cf18948	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-04-27 19:49:24.368968+00	
00000000-0000-0000-0000-000000000000	917ac9b8-6954-4395-bc44-20ef20859233	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-28 07:59:14.571995+00	
00000000-0000-0000-0000-000000000000	7533d194-e4c1-4f37-b8c6-d7222385ba34	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-28 07:59:14.595607+00	
00000000-0000-0000-0000-000000000000	208d8200-a886-4b99-a2da-488a83368477	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-29 19:55:16.557636+00	
00000000-0000-0000-0000-000000000000	89989c1b-aebd-43fb-a5b8-74bd5238c02e	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-29 19:55:16.58899+00	
00000000-0000-0000-0000-000000000000	400197df-1875-422a-b08a-6d2e8e66eecc	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-29 19:55:16.653199+00	
00000000-0000-0000-0000-000000000000	60c5f874-83ad-4aa2-8a56-1cccd73a400d	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-29 19:58:37.351292+00	
00000000-0000-0000-0000-000000000000	1b937fb7-36bd-4d7c-95c8-bbbe7d4ff4f8	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-29 19:58:37.352175+00	
00000000-0000-0000-0000-000000000000	54debeea-ff8d-4e33-998a-4dc7a90b29fb	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-04-29 19:58:37.377178+00	
00000000-0000-0000-0000-000000000000	cedd7680-1260-401d-a996-162d9b4a6e90	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-01 21:12:29.614393+00	
00000000-0000-0000-0000-000000000000	b93a6b76-7d00-4c17-8f64-1a4c82ac71b0	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-01 21:12:29.63975+00	
00000000-0000-0000-0000-000000000000	07327828-639c-4479-b9aa-60cbb379ea93	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-01 21:12:29.710201+00	
00000000-0000-0000-0000-000000000000	d8356729-f8ca-43fe-b6b4-e576941df895	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-01 22:59:53.402474+00	
00000000-0000-0000-0000-000000000000	20ad1400-9e31-4982-8ece-0389e86da68d	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-01 22:59:53.406223+00	
00000000-0000-0000-0000-000000000000	727b1adb-4caa-4c0a-840e-61c5a52d07dc	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-01 22:59:53.454604+00	
00000000-0000-0000-0000-000000000000	a10ec73d-0d35-48d0-be06-758f9d50108f	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 11:54:23.935696+00	
00000000-0000-0000-0000-000000000000	4f750eaf-344f-4cd5-af37-45d9c8ae0fed	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 11:54:23.96182+00	
00000000-0000-0000-0000-000000000000	8ff4de93-92dd-4b66-8145-e5d7a8d96d23	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 11:54:24.035784+00	
00000000-0000-0000-0000-000000000000	37adb941-738d-4500-987a-b4fdf8de1e8b	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 12:20:12.042895+00	
00000000-0000-0000-0000-000000000000	8d391ba1-f048-431b-889a-30a70cb58d42	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 12:20:12.046905+00	
00000000-0000-0000-0000-000000000000	5f1de7f7-69e7-4715-9a35-88b2ce9199e0	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 12:20:12.077361+00	
00000000-0000-0000-0000-000000000000	dd59658e-cf88-4893-8d12-0df5d8971503	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 12:52:44.847099+00	
00000000-0000-0000-0000-000000000000	cfc3acbc-cecb-44a2-87b3-870d4ed70aef	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 12:52:44.849997+00	
00000000-0000-0000-0000-000000000000	087caa3c-ba73-41ee-a4a4-75a6a7bc20c7	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 13:18:49.646668+00	
00000000-0000-0000-0000-000000000000	bd1a7603-7dda-4316-90cf-97a248889b50	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 13:18:49.651568+00	
00000000-0000-0000-0000-000000000000	1184812c-5ff6-446d-933b-f7d70e058a39	{"action":"logout","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-02 13:46:15.961864+00	
00000000-0000-0000-0000-000000000000	40fd3490-9c17-4337-bf9c-a3b0da02efac	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 13:48:03.647298+00	
00000000-0000-0000-0000-000000000000	7877691d-0ccb-4779-b5aa-a0447225556d	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 13:50:34.066801+00	
00000000-0000-0000-0000-000000000000	b392e07e-58b1-430f-8ed6-537a61ec2000	{"action":"login","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 14:49:37.420885+00	
00000000-0000-0000-0000-000000000000	c6ea2188-53e7-4df6-93e1-79425fa8746f	{"action":"token_refreshed","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 16:32:20.82353+00	
00000000-0000-0000-0000-000000000000	72ae854b-578b-4577-af80-6a50a3903a04	{"action":"token_revoked","actor_id":"b857b163-5984-4f68-bb78-f1737e7c5938","actor_username":"vl4d1m1r4@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-05-02 16:32:20.829005+00	
00000000-0000-0000-0000-000000000000	7f57a6d1-aa8c-4a58-b053-689bab72bc2b	{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cvetanovska.elenaa@gmail.com","user_id":"2a8aa7af-9eae-472c-83d6-42d25653c05a"}}	2025-05-02 16:35:19.234114+00	
00000000-0000-0000-0000-000000000000	7b2f7cdc-7876-4904-a460-5f684bacdbfa	{"action":"login","actor_id":"06bdfc8c-aa3d-4b18-bad5-72868c6f52a1","actor_username":"kkmladost97@yahoo.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 16:50:56.167942+00	
00000000-0000-0000-0000-000000000000	c8510f66-0aab-4055-972c-b3e6e0a85c07	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ivo.kotevski.bt@gmail.com","user_id":"395d2d7f-11b8-4e5c-9863-c94fd592234e","user_phone":""}}	2025-05-02 17:04:07.817364+00	
00000000-0000-0000-0000-000000000000	0739559e-2fef-4b93-b92b-33b3f0486e88	{"action":"login","actor_id":"395d2d7f-11b8-4e5c-9863-c94fd592234e","actor_username":"ivo.kotevski.bt@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 17:05:34.980506+00	
00000000-0000-0000-0000-000000000000	39968efb-3b9c-40db-9862-84675d01b7a3	{"action":"login","actor_id":"395d2d7f-11b8-4e5c-9863-c94fd592234e","actor_username":"ivo.kotevski.bt@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 17:05:35.950997+00	
00000000-0000-0000-0000-000000000000	65252a3d-eb26-48b4-8e2c-943d4c29851e	{"action":"user_signedup","actor_id":"2a8aa7af-9eae-472c-83d6-42d25653c05a","actor_username":"cvetanovska.elenaa@gmail.com","actor_via_sso":false,"log_type":"team"}	2025-05-02 17:13:13.904772+00	
00000000-0000-0000-0000-000000000000	b5b3f938-bb8b-4c04-ae3c-cbd0552b3eb1	{"action":"user_recovery_requested","actor_id":"2a8aa7af-9eae-472c-83d6-42d25653c05a","actor_username":"cvetanovska.elenaa@gmail.com","actor_via_sso":false,"log_type":"user"}	2025-05-02 17:39:16.655352+00	
00000000-0000-0000-0000-000000000000	26d6c9c1-bb91-4795-82d2-3a31d3d6f324	{"action":"login","actor_id":"2a8aa7af-9eae-472c-83d6-42d25653c05a","actor_username":"cvetanovska.elenaa@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-02 17:39:37.900624+00	
00000000-0000-0000-0000-000000000000	e6b7ffd4-ef4a-4e7e-9a68-eb90f0ba087b	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cvetanovska.elenaa@gmail.com","user_id":"2a8aa7af-9eae-472c-83d6-42d25653c05a","user_phone":""}}	2025-05-02 17:41:37.361408+00	
00000000-0000-0000-0000-000000000000	55527760-3f66-47b6-a229-5ebf902dd946	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"cvetanovska.elenaa@gmail.com","user_id":"685d36a2-6ad6-477a-a889-f1498671bccb","user_phone":""}}	2025-05-02 17:42:11.073689+00	
00000000-0000-0000-0000-000000000000	142b388f-acc6-4b73-a1c5-b0effe452315	{"action":"login","actor_id":"685d36a2-6ad6-477a-a889-f1498671bccb","actor_username":"cvetanovska.elenaa@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 17:57:31.805382+00	
00000000-0000-0000-0000-000000000000	eb95e77c-93e4-4878-bab9-fdb352583d08	{"action":"login","actor_id":"395d2d7f-11b8-4e5c-9863-c94fd592234e","actor_username":"ivo.kotevski.bt@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 17:57:55.097711+00	
00000000-0000-0000-0000-000000000000	daabc593-1625-4100-a7ea-2e93785f9d82	{"action":"logout","actor_id":"685d36a2-6ad6-477a-a889-f1498671bccb","actor_username":"cvetanovska.elenaa@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-05-02 17:58:56.513554+00	
00000000-0000-0000-0000-000000000000	c3d97d1a-9562-4b1b-b554-86bb504511d1	{"action":"login","actor_id":"395d2d7f-11b8-4e5c-9863-c94fd592234e","actor_username":"ivo.kotevski.bt@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-05-02 18:03:37.187429+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	authenticated	authenticated	kkmladost97@yahoo.com	$2a$10$w7lAyYwMRk98Una0WJ32eOVflPTi2.FqlXRm.9P34ebTQAlu4Jmoa	2025-04-03 18:07:10.43542+00	\N		\N		\N			\N	2025-05-02 16:50:56.171676+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-04-03 18:07:10.431316+00	2025-05-02 16:50:56.176734+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	685d36a2-6ad6-477a-a889-f1498671bccb	authenticated	authenticated	cvetanovska.elenaa@gmail.com	$2a$10$3mmoxTDIJ5gWdi5/90kcpu9yPbLMekZrAfaRsAJvbsPGQzZ5slKSK	2025-05-02 17:42:11.074982+00	\N		\N		\N			\N	2025-05-02 17:57:31.810206+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-05-02 17:42:11.069906+00	2025-05-02 17:57:31.818839+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	395d2d7f-11b8-4e5c-9863-c94fd592234e	authenticated	authenticated	ivo.kotevski.bt@gmail.com	$2a$10$ScHV09hRArCb9KibMFUcp.jyEqU/YGkJuHktSxMz5MRUGZdUNoosS	2025-05-02 17:04:07.820575+00	\N		\N		\N			\N	2025-05-02 18:03:37.192758+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-05-02 17:04:07.814999+00	2025-05-02 18:03:37.198129+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	d7d749ef-dcd8-4577-9833-e2745d6d77dd	authenticated	authenticated	aleksandar@cindrikj.net	$2a$10$AytfMYJ8N3.YedU2GZJLBuSJAUQXat2KVS.L074zPD/iS8fYOKqz.	2025-04-05 00:58:49.331729+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-04-05 00:58:49.285152+00	2025-04-05 00:58:49.337681+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b857b163-5984-4f68-bb78-f1737e7c5938	authenticated	authenticated	vl4d1m1r4@gmail.com	$2a$10$k046CSfzxYSoVDaAFftZL.zqxE0qJIqY/CToX9gQMVc.4jilJah1S	2025-03-28 14:10:55.508249+00	\N		\N		\N			\N	2025-05-02 14:49:37.424975+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-03-28 14:10:55.482802+00	2025-05-02 16:32:20.834742+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
b857b163-5984-4f68-bb78-f1737e7c5938	b857b163-5984-4f68-bb78-f1737e7c5938	{"sub": "b857b163-5984-4f68-bb78-f1737e7c5938", "email": "vl4d1m1r4@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-03-28 14:10:55.498906+00	2025-03-28 14:10:55.498965+00	2025-03-28 14:10:55.498965+00	3dbc4ecc-6d03-4bc1-b52a-11ba1158e020
06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	{"sub": "06bdfc8c-aa3d-4b18-bad5-72868c6f52a1", "email": "kkmladost97@yahoo.com", "email_verified": false, "phone_verified": false}	email	2025-04-03 18:07:10.433329+00	2025-04-03 18:07:10.433424+00	2025-04-03 18:07:10.433424+00	17d18ccd-5ba3-47b3-870f-7f6155c155b5
d7d749ef-dcd8-4577-9833-e2745d6d77dd	d7d749ef-dcd8-4577-9833-e2745d6d77dd	{"sub": "d7d749ef-dcd8-4577-9833-e2745d6d77dd", "email": "aleksandar@cindrikj.net", "email_verified": false, "phone_verified": false}	email	2025-04-05 00:58:49.301857+00	2025-04-05 00:58:49.302906+00	2025-04-05 00:58:49.302906+00	3c036f50-d824-4dce-adcc-673e516c8b07
395d2d7f-11b8-4e5c-9863-c94fd592234e	395d2d7f-11b8-4e5c-9863-c94fd592234e	{"sub": "395d2d7f-11b8-4e5c-9863-c94fd592234e", "email": "ivo.kotevski.bt@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-05-02 17:04:07.81642+00	2025-05-02 17:04:07.816473+00	2025-05-02 17:04:07.816473+00	94532e9d-e82d-4e35-8097-72da1bc2f064
685d36a2-6ad6-477a-a889-f1498671bccb	685d36a2-6ad6-477a-a889-f1498671bccb	{"sub": "685d36a2-6ad6-477a-a889-f1498671bccb", "email": "cvetanovska.elenaa@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-05-02 17:42:11.071433+00	2025-05-02 17:42:11.071491+00	2025-05-02 17:42:11.071491+00	86f7e5ac-1368-4cbb-8c00-665e8f54a202
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
93dadca4-7899-4ded-bfc1-96427d53dc8d	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	2025-05-02 13:48:03.648876+00	2025-05-02 13:48:03.648876+00	\N	aal1	\N	\N	node-fetch	185.100.245.179	\N
1e6cb860-ba62-4fcc-aaa7-b589396af46b	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	2025-05-02 13:50:34.070704+00	2025-05-02 13:50:34.070704+00	\N	aal1	\N	\N	node-fetch	34.238.41.241	\N
f2a7aa21-08e9-4b86-93bd-ceca48d3d232	b857b163-5984-4f68-bb78-f1737e7c5938	2025-05-02 14:49:37.425053+00	2025-05-02 16:32:20.83603+00	\N	aal1	\N	2025-05-02 16:32:20.835962	Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36	185.100.245.98	\N
00af2394-2b49-4df4-89f1-2fd9a6e71787	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	2025-05-02 16:50:56.171763+00	2025-05-02 16:50:56.171763+00	\N	aal1	\N	\N	node-fetch	44.220.54.127	\N
e40f3472-a27c-4b37-8663-0e1277937da4	395d2d7f-11b8-4e5c-9863-c94fd592234e	2025-05-02 17:05:34.982263+00	2025-05-02 17:05:34.982263+00	\N	aal1	\N	\N	node-fetch	54.164.189.113	\N
62ec3167-a8b4-44a9-aff4-8e99b957d427	395d2d7f-11b8-4e5c-9863-c94fd592234e	2025-05-02 17:05:35.951769+00	2025-05-02 17:05:35.951769+00	\N	aal1	\N	\N	node-fetch	54.164.189.113	\N
8ad78013-b91e-4407-b204-6d712a0fc7e9	395d2d7f-11b8-4e5c-9863-c94fd592234e	2025-05-02 17:57:55.099215+00	2025-05-02 17:57:55.099215+00	\N	aal1	\N	\N	node-fetch	54.89.202.143	\N
834efa96-fa8c-432e-990f-314c1d58f879	395d2d7f-11b8-4e5c-9863-c94fd592234e	2025-05-02 18:03:37.192855+00	2025-05-02 18:03:37.192855+00	\N	aal1	\N	\N	node-fetch	13.217.83.139	\N
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
93dadca4-7899-4ded-bfc1-96427d53dc8d	2025-05-02 13:48:03.663736+00	2025-05-02 13:48:03.663736+00	password	aa333c1c-8499-42a6-9415-0f480674e14f
1e6cb860-ba62-4fcc-aaa7-b589396af46b	2025-05-02 13:50:34.076019+00	2025-05-02 13:50:34.076019+00	password	b78fa272-fff3-4835-b215-cfae094f004c
f2a7aa21-08e9-4b86-93bd-ceca48d3d232	2025-05-02 14:49:37.4346+00	2025-05-02 14:49:37.4346+00	password	bc5aed3d-a8cb-4e9e-97b0-a5898c531709
00af2394-2b49-4df4-89f1-2fd9a6e71787	2025-05-02 16:50:56.177348+00	2025-05-02 16:50:56.177348+00	password	b0da9344-0706-47e4-8096-44f189d4d9ec
e40f3472-a27c-4b37-8663-0e1277937da4	2025-05-02 17:05:34.987999+00	2025-05-02 17:05:34.987999+00	password	b0fc6c82-0a01-4443-a0b2-d70714b0fe1b
62ec3167-a8b4-44a9-aff4-8e99b957d427	2025-05-02 17:05:35.953643+00	2025-05-02 17:05:35.953643+00	password	bfaaf62d-154f-4dec-b3ee-c6942dde3f70
8ad78013-b91e-4407-b204-6d712a0fc7e9	2025-05-02 17:57:55.101379+00	2025-05-02 17:57:55.101379+00	password	e60b8880-565e-4939-b599-cbed4fb0e060
834efa96-fa8c-432e-990f-314c1d58f879	2025-05-02 18:03:37.198817+00	2025-05-02 18:03:37.198817+00	password	6fee5a26-5c45-4c8f-8b10-f708bdce1574
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid") FROM stdin;
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	86	-Hy8CAV-IM2Jbg6SqkQRXg	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	f	2025-05-02 13:48:03.657495+00	2025-05-02 13:48:03.657495+00	\N	93dadca4-7899-4ded-bfc1-96427d53dc8d
00000000-0000-0000-0000-000000000000	87	6Bcucn1RUlAa_kCiKsZvuQ	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	f	2025-05-02 13:50:34.072764+00	2025-05-02 13:50:34.072764+00	\N	1e6cb860-ba62-4fcc-aaa7-b589396af46b
00000000-0000-0000-0000-000000000000	88	xwKLdtoURJWU4YAkk21Gdw	b857b163-5984-4f68-bb78-f1737e7c5938	t	2025-05-02 14:49:37.430158+00	2025-05-02 16:32:20.829607+00	\N	f2a7aa21-08e9-4b86-93bd-ceca48d3d232
00000000-0000-0000-0000-000000000000	89	qO4_XrtJlfqimoDwPlKT1g	b857b163-5984-4f68-bb78-f1737e7c5938	f	2025-05-02 16:32:20.833102+00	2025-05-02 16:32:20.833102+00	xwKLdtoURJWU4YAkk21Gdw	f2a7aa21-08e9-4b86-93bd-ceca48d3d232
00000000-0000-0000-0000-000000000000	90	sluegi90-eH3aSaUIbuXUg	06bdfc8c-aa3d-4b18-bad5-72868c6f52a1	f	2025-05-02 16:50:56.173607+00	2025-05-02 16:50:56.173607+00	\N	00af2394-2b49-4df4-89f1-2fd9a6e71787
00000000-0000-0000-0000-000000000000	91	uBew9LivXQdwTL7r8sKHjA	395d2d7f-11b8-4e5c-9863-c94fd592234e	f	2025-05-02 17:05:34.984108+00	2025-05-02 17:05:34.984108+00	\N	e40f3472-a27c-4b37-8663-0e1277937da4
00000000-0000-0000-0000-000000000000	92	pYBOs_U5BJkU8Z_NFvvudg	395d2d7f-11b8-4e5c-9863-c94fd592234e	f	2025-05-02 17:05:35.952458+00	2025-05-02 17:05:35.952458+00	\N	62ec3167-a8b4-44a9-aff4-8e99b957d427
00000000-0000-0000-0000-000000000000	96	19v4BKOmDBsYEnN5W5ydBw	395d2d7f-11b8-4e5c-9863-c94fd592234e	f	2025-05-02 17:57:55.100002+00	2025-05-02 17:57:55.100002+00	\N	8ad78013-b91e-4407-b204-6d712a0fc7e9
00000000-0000-0000-0000-000000000000	97	pgTTIqzQdMH5PW5WV1SWHA	395d2d7f-11b8-4e5c-9863-c94fd592234e	f	2025-05-02 18:03:37.195334+00	2025-05-02 18:03:37.195334+00	\N	834efa96-fa8c-432e-990f-314c1d58f879
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--

COPY "pgsodium"."key" ("id", "status", "created", "expires", "key_type", "key_id", "key_context", "name", "associated_data", "raw_key", "raw_key_nonce", "parent_key", "comment", "user_data") FROM stdin;
\.


--
-- Data for Name: tournaments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."tournaments" ("id", "name", "status", "start_date", "end_date", "created_at") FROM stdin;
13	13 International Easter Basketball Tournament Bitola 2025	upcoming	2025-05-03	2025-05-04	2025-04-03 09:23:24.214794+00
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."categories" ("id", "tournament_id", "name", "created_at") FROM stdin;
19	13	Girls 2011/12	2025-04-21 19:21:33.976558+00
20	13	Boys 2012/13	2025-04-21 19:28:19.065076+00
22	13	Boys/Girls 2015	2025-04-21 19:48:49.99622+00
23	13	Boys/Girls 2016	2025-04-21 19:58:48.671247+00
25	13	Boys/Girls 2014	2025-04-25 07:24:22.964815+00
\.


--
-- Data for Name: matches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "public"."matches" ("id", "tournament_id", "category_id", "team1", "team2", "score1", "score2", "date", "created_at", "time", "location", "group_name", "is_playoff") FROM stdin;
70	13	19	ZKK Probasket Kavadarci	ZKK Struga   Struga	\N	\N	2025-05-03	2025-04-21 19:23:52.629943+00	11:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
188	13	25	KK MLADOST Bitola	KK DEKSA Prilep	\N	\N	2025-05-04	2025-04-27 20:10:44.828862+00	11:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	B	f
189	13	25	KK DEKSA Prilep	KK PROBASKET Kavadarci	\N	\N	2025-05-03	2025-04-27 20:11:06.797216+00	13:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	B	f
73	13	19	ZKK Struga   Struga	ZKK Kolibri Ohrid	\N	\N	2025-05-04	2025-04-21 19:25:25.252768+00	10:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
74	13	19	ZKK Pelister  Bitola	ZKK DEKSA Prilep	\N	\N	2025-05-04	2025-04-21 19:25:48.470086+00	09:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
75	13	19	ZKK DEKSA Prilep	ZKK Struga   Struga	\N	\N	2025-05-03	2025-04-21 19:26:12.638436+00	13:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
178	13	20	KK SPORTISIMO Kavadarci	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-27 19:53:32.326232+00	19:00:00	Osnovno Uchilishte Kole Kaninski	A	f
135	13	20	KK DIBRA EAGLES Debar	KK SPORTISIMO Kavadarci	\N	\N	2025-05-04	2025-04-24 18:05:36.579711+00	12:00:00	Gimnazija Josip Broz Tito	A	f
136	13	20	KK KOLIBRI Ohrid	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-24 18:05:59.620923+00	10:00:00	Gimnazija Josip Broz Tito	B	f
171	13	22	KK PROBASKET  Kavadarci	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-25 14:32:05.548153+00	12:00:00	Osnovno Uchilishte Kole Kaninski	A	f
186	13	25	KK KOLIBRI Ohrid	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-27 20:10:03.859501+00	17:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
173	13	22	KK MLADOST   Bitola	KK DEKSA Prilep	\N	\N	2025-05-04	2025-04-25 14:33:03.106582+00	13:30:00	Osnovno Uchilishte Kole Kaninski	A	f
190	13	25	KK MLADOST Bitola	 KK STRUGA  Struga	\N	\N	2025-05-04	2025-04-27 20:11:32.541763+00	10:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	B	f
181	13	20	KK PLAY OFF Srbija	KK KOLIBRI Ohrid	\N	\N	2025-05-03	2025-04-27 19:56:21.9924+00	13:00:00	Gimnazija Josip Broz Tito	B	f
133	13	20	KK PROBASKET Kavadarci	KK DIBRA EAGLES Debar	\N	\N	2025-05-03	2025-04-24 18:04:54.311665+00	11:00:00	Gimnazija Josip Broz Tito	A	f
192	13	25	 KK STRUGA  Struga	KK PROBASKET Kavadarci	\N	\N	2025-05-04	2025-04-27 20:12:04.452198+00	09:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	B	f
172	13	22	KK MLADOST Bitola	KK Kolibri Ohrid	\N	\N	2025-05-04	2025-04-25 14:32:36.950051+00	11:15:00	Osnovno Uchilishte Kole Kaninski	A	f
182	13	25	KK SPORTISIMO Kavadarci	KK JUNIOR Bitola	\N	\N	2025-05-04	2025-04-27 20:08:45.52289+00	14:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
132	13	20	KK SPORTISIMO Kavadarci	KK PROBASKET Kavadarci	\N	\N	2025-05-04	2025-04-24 18:04:32.702392+00	09:00:00	Gimnazija Josip Broz Tito	A	f
183	13	25	KK JUNIOR Bitola	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-27 20:09:05.422964+00	11:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
184	13	25	KK SPORTISIMO Kavadarci	KK KOLIBRI Ohrid	\N	\N	2025-05-04	2025-04-27 20:09:25.043728+00	13:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
139	13	20	KK MLADOST Bitola	KK PLAY OFF Srbija	\N	\N	2025-05-04	2025-04-24 18:10:50.136727+00	11:00:00	Gimnazija Josip Broz Tito	B	f
193	13	25	KK DEKSA Prilep	 KK STRUGA  Struga	\N	\N	2025-05-04	2025-04-27 20:12:18.077266+00	12:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	B	f
191	13	25	KK PROBASKET Kavadarci	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-27 20:11:49.423746+00	15:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	B	f
146	13	20	KK PLAY OFF Srbija	 BC ARISTOTELIS Greece	\N	\N	2025-05-03	2025-04-24 18:14:55.696048+00	16:00:00	Gimnazija Josip Broz Tito	B	f
94	13	20	2nd Group A	2nd Group B	\N	\N	2025-05-04	2025-04-21 19:38:56.13599+00	13:00:00	Gimnazija Josip Broz Tito	3RD PLACE	t
95	13	20	1st Group A	1st Group B	\N	\N	2025-05-04	2025-04-21 19:39:25.025125+00	14:00:00	Gimnazija Josip Broz Tito	FINAL	t
76	13	19	ZKK Kolibri Ohrid	ZKK Probasket Kavadarci	\N	\N	2025-05-04	2025-04-21 19:26:34.772807+00	13:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
77	13	19	ZKK Probasket Kavadarci	ZKK DEKSA Prilep	\N	\N	2025-05-04	2025-04-21 19:26:55.431345+00	11:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
69	13	19	ZKK Kolibri Ohrid	ZKK Pelister  Bitola	\N	\N	2025-05-03	2025-04-21 19:23:07.30893+00	12:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
78	13	19	ZKK Struga   Struga	ZKK Pelister  Bitola	\N	\N	2025-05-04	2025-04-21 19:27:16.040969+00	12:30:00	Tehnichko Uchilishte Gjorgi Naumov	A	f
68	13	19	ZKK DEKSA Prilep	ZKK Kolibri Ohrid	\N	\N	2025-05-03	2025-04-21 19:22:43.387909+00	16:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
187	13	25	KK JUNIOR Bitola	KK KOLIBRI Ohrid	\N	\N	2025-05-03	2025-04-27 20:10:20.65621+00	10:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
196	13	25	1st Group A	1st Group B	\N	\N	2025-05-04	2025-04-27 20:14:01.37832+00	16:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	FINAL	t
185	13	25	KK MLADOST Bitola	KK SPORTISIMO Kavadarci	\N	\N	2025-05-03	2025-04-27 20:09:47.523967+00	19:15:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
137	13	20	 BC ARISTOTELIS Greece	KK KOLIBRI Ohrid	\N	\N	2025-05-04	2025-04-24 18:06:23.465216+00	10:00:00	Gimnazija Josip Broz Tito	B	f
169	13	22	KK DEKSA Prilep	KK Kolibri Ohrid	\N	\N	2025-05-03	2025-04-25 14:30:58.556789+00	10:00:00	Osnovno Uchilishte Kole Kaninski	A	f
124	13	23	KK MLADOST Bitola	KK MLADOST 1  Bitola	\N	\N	2025-05-03	2025-04-21 19:59:19.220962+00	18:30:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
179	13	20	KK MLADOST Bitola	KK DIBRA EAGLES Debar	\N	\N	2025-05-03	2025-04-27 19:54:25.167959+00	14:00:00	Gimnazija Josip Broz Tito	A	f
180	13	20	KK PROBASKET Kavadarci	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-27 19:54:50.833985+00	15:00:00	Gimnazija Josip Broz Tito	A	f
174	13	22	KK DEKSA Prilep	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-25 14:33:48.434826+00	15:00:00	Osnovno Uchilishte Kole Kaninski	A	f
177	13	22	KK MLADOST Bitola	KK MLADOST   Bitola	\N	\N	2025-05-04	2025-04-25 14:35:04.781716+00	09:00:00	Osnovno Uchilishte Kole Kaninski	A	f
131	13	19	ZKK Pelister  Bitola	ZKK Probasket Kavadarci	\N	\N	2025-05-03	2025-04-24 18:00:32.944687+00	14:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	A	f
194	13	25	2nd Group A	2nd Group B	\N	\N	2025-05-04	2025-04-27 20:12:54.042976+00	15:00:00	Medicinsko Uchilishte D-r Jovan Kalauzi	3RD PLACE	t
147	13	20	KK MLADOST Bitola	 BC ARISTOTELIS Greece	\N	\N	2025-05-03	2025-04-24 18:15:32.604904+00	12:00:00	Gimnazija Josip Broz Tito	B	f
168	13	22	KK MLADOST   Bitola	KK PROBASKET  Kavadarci	\N	\N	2025-05-03	2025-04-25 14:30:12.28496+00	16:00:00	Osnovno Uchilishte Kole Kaninski	A	f
170	13	22	KK Kolibri Ohrid	KK MLADOST   Bitola	\N	\N	2025-05-03	2025-04-25 14:31:29.800407+00	13:00:00	Osnovno Uchilishte Kole Kaninski	A	f
125	13	23	KK MLADOST 1  Bitola	KK KOLIBRI Ohrid	\N	\N	2025-05-04	2025-04-21 19:59:34.513694+00	10:30:00	Osnovno Uchilishte Kole Kaninski	A	f
126	13	23	KK MLADOST Bitola	KK JUNIOR  Bitola	\N	\N	2025-05-04	2025-04-21 19:59:54.690255+00	12:00:00	Osnovno Uchilishte Kole Kaninski	A	f
175	13	22	KK Kolibri Ohrid	KK PROBASKET  Kavadarci	\N	\N	2025-05-04	2025-04-25 14:34:14.863639+00	09:45:00	Osnovno Uchilishte Kole Kaninski	A	f
176	13	22	KK PROBASKET  Kavadarci	KK DEKSA Prilep	\N	\N	2025-05-04	2025-04-25 14:34:37.352167+00	12:45:00	Osnovno Uchilishte Kole Kaninski	A	f
127	13	23	KK KOLIBRI Ohrid	KK MLADOST Bitola	\N	\N	2025-05-03	2025-04-21 20:00:18.085552+00	11:00:00	Osnovno Uchilishte Kole Kaninski	A	f
128	13	23	KK JUNIOR  Bitola	KK KOLIBRI Ohrid	\N	\N	2025-05-03	2025-04-21 20:00:37.670577+00	14:00:00	Osnovno Uchilishte Kole Kaninski	A	f
129	13	23	KK MLADOST 1  Bitola	KK JUNIOR  Bitola	\N	\N	2025-05-03	2025-04-21 20:01:19.243652+00	09:00:00	Osnovno Uchilishte Kole Kaninski	A	f
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 97, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 25, true);


--
-- Name: matches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."matches_id_seq"', 196, true);


--
-- Name: tournaments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."tournaments_id_seq"', 14, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
