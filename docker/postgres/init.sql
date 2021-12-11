--
-- PostgreSQL database dump
--

-- Dumped from database version 12.9 (Debian 12.9-1.pgdg110+1)
-- Dumped by pg_dump version 12.9 (Debian 12.9-1.pgdg110+1)

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
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA hdb_catalog;


ALTER SCHEMA hdb_catalog OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


ALTER FUNCTION hdb_catalog.gen_hasura_uuid() OWNER TO postgres;

--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: postgres
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
    trace_context json;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
      trace_context := current_setting('hasura.tracecontext', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
      BEGIN
        trace_context := current_setting('hasura.tracecontext');
      EXCEPTION WHEN OTHERS THEN
        trace_context := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables,
      'trace_context', trace_context
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


ALTER FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) OWNER TO postgres;

--
-- Name: has_translations(jsonb); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.has_translations(object jsonb) RETURNS boolean
    LANGUAGE plpgsql STABLE
    AS $$
DECLARE
    required_languages text[] := ARRAY(SELECT "ISO_639_1" FROM public.language);
BEGIN
    RETURN jsonb_typeof(object) = 'object'::text
    AND object ?& required_languages;
END;
$$;


ALTER FUNCTION public.has_translations(object jsonb) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.role (
    id integer NOT NULL,
    "dueDate" timestamp with time zone,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "timeCommitmentMin" integer NOT NULL,
    "timeCommitmentMax" integer NOT NULL,
    "workingCircleId" integer NOT NULL,
    "localGroupId" integer NOT NULL,
    "filledDate" timestamp with time zone,
    responsibilities jsonb NOT NULL,
    email text NOT NULL,
    phone text,
    "mattermostId" text NOT NULL,
    requirements jsonb,
    title jsonb NOT NULL,
    description jsonb,
    "timeCommitment" jsonb,
    "authorId" text NOT NULL,
    CONSTRAINT description_has_translations CHECK (public.has_translations(description)),
    CONSTRAINT requirements_has_translations CHECK (public.has_translations(requirements)),
    CONSTRAINT responsibilities_has_translations CHECK (public.has_translations(responsibilities)),
    CONSTRAINT time_commitment_has_subfields CHECK (((jsonb_typeof("timeCommitment") = 'object'::text) AND ("timeCommitment" ?& ARRAY['min'::text, 'max'::text]))),
    CONSTRAINT title_has_translations CHECK (public.has_translations(title))
);


ALTER TABLE public.role OWNER TO postgres;

--
-- Name: rolesSearch(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public."rolesSearch"(search text, selected_language text) RETURNS SETOF public.role
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN QUERY
    SELECT *
    from role
    where
        -- filter out roles with a past due date
        ("dueDate" >= now() OR "dueDate" is null)
        -- filter out roles that are already filled
        AND "filledDate" is null
        -- get roles with one of the text fields matching search string
        AND (title->>selected_language ilike ('%' || search || '%')
        OR responsibilities->>selected_language ilike ('%' || search || '%')
        OR description->>selected_language ilike ('%' || search || '%')
        OR requirements->>selected_language ilike ('%' || search || '%'));
    RETURN;
END;
$$;


ALTER FUNCTION public."rolesSearch"(search text, selected_language text) OWNER TO postgres;

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.event_invocation_logs OWNER TO postgres;

--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked timestamp with time zone,
    next_retry_at timestamp without time zone,
    archived boolean DEFAULT false NOT NULL
);


ALTER TABLE hdb_catalog.event_log OWNER TO postgres;

--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


ALTER TABLE hdb_catalog.hdb_action_log OWNER TO postgres;

--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_cron_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    additional_payload json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_cron_events OWNER TO postgres;

--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


ALTER TABLE hdb_catalog.hdb_metadata OWNER TO postgres;

--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE hdb_catalog.hdb_scheduled_event_invocation_logs OWNER TO postgres;

--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


ALTER TABLE hdb_catalog.hdb_scheduled_events OWNER TO postgres;

--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


ALTER TABLE hdb_catalog.hdb_schema_notifications OWNER TO postgres;

--
-- Name: hdb_source_catalog_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_source_catalog_version (
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL
);


ALTER TABLE hdb_catalog.hdb_source_catalog_version OWNER TO postgres;

--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: postgres
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL
);


ALTER TABLE hdb_catalog.hdb_version OWNER TO postgres;

--
-- Name: config; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.config (
    alive boolean NOT NULL
);


ALTER TABLE public.config OWNER TO postgres;

--
-- Name: language; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.language (
    "ISO_639_1" text NOT NULL
);


ALTER TABLE public.language OWNER TO postgres;

--
-- Name: TABLE language; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.language IS 'enum table used for language checks in multilingual fields of other tables';


--
-- Name: localGroup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."localGroup" (
    id integer NOT NULL,
    title text NOT NULL
);


ALTER TABLE public."localGroup" OWNER TO postgres;

--
-- Name: local_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.local_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.local_group_id_seq OWNER TO postgres;

--
-- Name: local_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.local_group_id_seq OWNED BY public."localGroup".id;


--
-- Name: role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.role_id_seq OWNER TO postgres;

--
-- Name: role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.role_id_seq OWNED BY public.role.id;


--
-- Name: workingCircle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."workingCircle" (
    id integer NOT NULL,
    title jsonb NOT NULL,
    color text DEFAULT '#DC4F00'::text,
    CONSTRAINT title_has_translations CHECK (public.has_translations(title))
);


ALTER TABLE public."workingCircle" OWNER TO postgres;

--
-- Name: working_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.working_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.working_group_id_seq OWNER TO postgres;

--
-- Name: working_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.working_group_id_seq OWNED BY public."workingCircle".id;


--
-- Name: localGroup id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."localGroup" ALTER COLUMN id SET DEFAULT nextval('public.local_group_id_seq'::regclass);


--
-- Name: role id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role ALTER COLUMN id SET DEFAULT nextval('public.role_id_seq'::regclass);


--
-- Name: workingCircle id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."workingCircle" ALTER COLUMN id SET DEFAULT nextval('public.working_group_id_seq'::regclass);


--
-- Data for Name: event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: event_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.event_log (id, schema_name, table_name, trigger_name, payload, delivered, error, tries, created_at, locked, next_retry_at, archived) FROM stdin;
\.


--
-- Data for Name: hdb_action_log; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_action_log (id, action_name, input_payload, request_headers, session_variables, response_payload, errors, created_at, response_received_at, status) FROM stdin;
\.


--
-- Data for Name: hdb_cron_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_cron_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_cron_events (id, trigger_name, scheduled_time, additional_payload, status, tries, created_at, next_retry_at) FROM stdin;
\.


--
-- Data for Name: hdb_metadata; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_metadata (id, metadata, resource_version) FROM stdin;
1	{"sources":[{"kind":"postgres","name":"default","tables":[{"select_permissions":[{"role":"public","permission":{"columns":["alive"],"filter":{}}},{"role":"user","permission":{"columns":["alive"],"filter":{}}}],"table":{"schema":"public","name":"config"}},{"select_permissions":[{"role":"public","permission":{"columns":["ISO_639_1"],"filter":{}}},{"role":"user","permission":{"allow_aggregations":true,"columns":["ISO_639_1"],"filter":{}}}],"is_enum":true,"table":{"schema":"public","name":"language"}},{"select_permissions":[{"role":"public","permission":{"allow_aggregations":true,"columns":["id","title"],"filter":{}}},{"role":"user","permission":{"allow_aggregations":true,"columns":["id","title"],"filter":{}}}],"configuration":{"custom_root_fields":{"select_aggregate":"localGroup_aggregate","select_by_pk":"localGroup","select":"localGroups"},"custom_column_names":{}},"table":{"schema":"public","name":"localGroup"},"array_relationships":[{"using":{"foreign_key_constraint_on":{"column":"localGroupId","table":{"schema":"public","name":"role"}}},"name":"roles"}]},{"select_permissions":[{"role":"public","permission":{"columns":["id","dueDate","createdDate","timeCommitmentMin","timeCommitmentMax","workingCircleId","localGroupId","filledDate","responsibilities","email","phone","mattermostId","requirements","title","description","timeCommitment","authorId"],"filter":{}}},{"role":"user","permission":{"columns":["id","dueDate","createdDate","timeCommitmentMin","timeCommitmentMax","workingCircleId","localGroupId","filledDate","responsibilities","email","phone","mattermostId","requirements","title","description","timeCommitment","authorId"],"filter":{}}}],"object_relationships":[{"using":{"foreign_key_constraint_on":"localGroupId"},"name":"localGroup"},{"using":{"foreign_key_constraint_on":"workingCircleId"},"name":"workingCircle"}],"insert_permissions":[{"role":"user","permission":{"backend_only":false,"set":{"authorId":"x-hasura-User-Id"},"check":{},"columns":["description","dueDate","email","filledDate","localGroupId","mattermostId","phone","requirements","responsibilities","timeCommitment","timeCommitmentMax","timeCommitmentMin","title","workingCircleId"]}}],"configuration":{"custom_root_fields":{"select_aggregate":"roles_aggregate","select_by_pk":"role","select":"roles"},"custom_column_names":{}},"table":{"schema":"public","name":"role"},"update_permissions":[{"role":"user","permission":{"set":{"authorId":"x-hasura-User-Id"},"check":{},"columns":["description","dueDate","email","filledDate","localGroupId","mattermostId","phone","requirements","responsibilities","timeCommitment","timeCommitmentMax","timeCommitmentMin","title","workingCircleId"],"filter":{"authorId":{"_eq":"X-Hasura-User-Id"}}}}],"delete_permissions":[{"role":"user","permission":{"filter":{"authorId":{"_eq":"X-Hasura-User-Id"}}}}]},{"select_permissions":[{"role":"public","permission":{"allow_aggregations":true,"columns":["id","title","color"],"filter":{}}},{"role":"user","permission":{"allow_aggregations":true,"columns":["id","title","color"],"filter":{}}}],"configuration":{"custom_root_fields":{"select_aggregate":"workingCircles_aggregate","select_by_pk":"workingCircle","select":"workingCircles"},"custom_column_names":{}},"table":{"schema":"public","name":"workingCircle"},"array_relationships":[{"using":{"foreign_key_constraint_on":{"column":"workingCircleId","table":{"schema":"public","name":"role"}}},"name":"roles"}]}],"configuration":{"connection_info":{"use_prepared_statements":false,"database_url":{"from_env":"HASURA_GRAPHQL_DATABASE_URL"},"isolation_level":"read-committed","pool_settings":{"connection_lifetime":600,"retries":1,"idle_timeout":180,"max_connections":50}}},"functions":[{"function":{"schema":"public","name":"rolesSearch"}}]}],"version":3}	592
\.


--
-- Data for Name: hdb_scheduled_event_invocation_logs; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_event_invocation_logs (id, event_id, status, request, response, created_at) FROM stdin;
\.


--
-- Data for Name: hdb_scheduled_events; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_scheduled_events (id, webhook_conf, scheduled_time, retry_conf, payload, header_conf, status, tries, created_at, next_retry_at, comment) FROM stdin;
\.


--
-- Data for Name: hdb_schema_notifications; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_schema_notifications (id, notification, resource_version, instance_id, updated_at) FROM stdin;
1	{"metadata":true,"remote_schemas":[],"sources":["default"]}	592	87f25044-e102-4e53-984e-ef5e9e2b9828	2021-04-19 07:21:25.985605+00
\.


--
-- Data for Name: hdb_source_catalog_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_source_catalog_version (version, upgraded_on) FROM stdin;
1	2021-02-26 17:30:40.96278+00
\.


--
-- Data for Name: hdb_version; Type: TABLE DATA; Schema: hdb_catalog; Owner: postgres
--

COPY hdb_catalog.hdb_version (hasura_uuid, version, upgraded_on, cli_state, console_state) FROM stdin;
885fc441-c38d-4174-9e24-7636065b14e6	47	2021-12-06 19:03:55.560483+00	{}	{"console_notifications": {"admin": {"date": "2021-12-06T19:32:54.005Z", "read": "default", "showBadge": false}}, "telemetryNotificationShown": true}
\.


--
-- Data for Name: config; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.config (alive) FROM stdin;
\.


--
-- Data for Name: language; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.language ("ISO_639_1") FROM stdin;
en
nl
\.


--
-- Data for Name: localGroup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."localGroup" (id, title) FROM stdin;
1	Alkmaar
2	Amersfoort
3	Amstelveen
4	Amsterdam
5	Arnhem/Nijmegen
6	Brabant
7	Castricum
8	Delft
9	Den Haag
10	Deventer
11	Dordrecht
12	Enschede
13	Groningen
14	Haarlem
15	Leeuwarden/Fryslân
16	Leiden
17	Maastricht
18	Roermond
19	Rotterdam
20	Utrecht
21	Wageningen
22	Zaandam
23	Zeeland
24	Zwolle
25	NL
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.role (id, "dueDate", "createdDate", "timeCommitmentMin", "timeCommitmentMax", "workingCircleId", "localGroupId", "filledDate", responsibilities, email, phone, "mattermostId", requirements, title, description, "timeCommitment", "authorId") FROM stdin;
\.


--
-- Data for Name: workingCircle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."workingCircle" (id, title, color) FROM stdin;
1	{"en": "Media & Communications", "nl": "Media & Communicatie"}	#FFC11E
2	{"en": "Outreach & Training", "nl": "Outreach & Training"}	#CF6297
3	{"en": "Regenerative Culture", "nl": "Regeneratieve Cultuur"}	#14AA37
4	{"en": "Action & Logistics", "nl": "Actie & Logistiek"}	#DC4F00
5	{"en": "Political Strategy & Change", "nl": "Politieke Strategie & Verandering"}	#3860AA
6	{"en": "Arts in Action", "nl": "Kunst in actie"}	#BED276
7	{"en": "Tech", "nl": "Tech"}	#75D0F1
8	{"en": "Integration", "nl": "Integratie"}	#ED9BC4
9	{"en": "Inclusion & Power", "nl": "Inclusie & Machtsstucturen"}	#986297
10	{"en": "Finance", "nl": "Financiën"}	#F7EE6A
15	{"en": "Future of Democracy", "nl": "Toekomstige Democratie"}	#FF8039
16	{"en": "Coordination Circle", "nl": "Coördinatie Cirkel"}	#C80082
\.


--
-- Name: local_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.local_group_id_seq', 25, true);


--
-- Name: role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.role_id_seq', 199, true);


--
-- Name: working_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.working_group_id_seq', 16, true);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: config config_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.config
    ADD CONSTRAINT config_pkey PRIMARY KEY (alive);


--
-- Name: language language_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.language
    ADD CONSTRAINT language_pkey PRIMARY KEY ("ISO_639_1");


--
-- Name: localGroup local_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."localGroup"
    ADD CONSTRAINT local_group_pkey PRIMARY KEY (id);


--
-- Name: localGroup local_group_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."localGroup"
    ADD CONSTRAINT local_group_title_key UNIQUE (title);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: workingCircle working_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."workingCircle"
    ADD CONSTRAINT working_group_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_created_at_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_created_at_idx ON hdb_catalog.event_log USING btree (created_at);


--
-- Name: event_log_delivered_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_delivered_idx ON hdb_catalog.event_log USING btree (delivered);


--
-- Name: event_log_locked_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_locked_idx ON hdb_catalog.event_log USING btree (locked);


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_source_catalog_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_source_catalog_version_one_row ON hdb_catalog.hdb_source_catalog_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: postgres
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: event_invocation_logs event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.event_log(id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: postgres
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: role role_localGroup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "role_localGroup_id_fkey" FOREIGN KEY ("localGroupId") REFERENCES public."localGroup"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: role role_workingCircle_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT "role_workingCircle_id_fkey" FOREIGN KEY ("workingCircleId") REFERENCES public."workingCircle"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

