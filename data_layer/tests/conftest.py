import os
from urllib.parse import urlparse

import psycopg
from psycopg.rows import dict_row
import pytest
import supabase
from psycopg import Connection
from supabase.lib.realtime_client import SupabaseRealtimeClient
from dotenv import load_dotenv

from fake_layers.business import Business
from fake_layers.client import Client

load_dotenv()
supabase_project = os.getenv("SUPABASE_PROJECT")
postgres_port = os.getenv("POSTGRES_PORT")
supabase_url = f"https://{supabase_project}.supabase.co"
supabase_key = os.getenv("SUPABASE_KEY")
postgres_password = "your-super-secret-and-long-postgres-password"
postgres_url = (
    f"postgresql://postgres:{postgres_password}@localhost:{postgres_port}/postgres"
)


@pytest.fixture()
def postgres_connection_params() -> dict:
    db_params = urlparse(postgres_url)

    return dict(
        dbname=db_params.path[1:],
        user=db_params.username,
        password=db_params.password,
        host=db_params.hostname,
        port=db_params.port,
    )


@pytest.fixture()
def postgres_connection(postgres_connection_params) -> Connection:
    return psycopg.connect(**postgres_connection_params)


@pytest.fixture()
def supabase_client() -> supabase.Client:
    """Return the default supabase"""
    # here we use a client with a service role for both client and business layers.
    return supabase.create_client(supabase_url, supabase_key)


@pytest.fixture()
def realtime_client() -> SupabaseRealtimeClient:
    """Return the default supabase"""
    # here we use a client with a service role for both client and business layers.
    realtime_url = f"{supabase_url}/realtime/v1".replace("http", "ws")
    return SupabaseRealtimeClient(realtime_url, {"params": {"apikey": supabase_key}})


@pytest.fixture()
def business(supabase_client) -> Business:
    return Business(supabase_client)


@pytest.fixture()
def app_client(supabase_client) -> Client:
    return Client(supabase_client)


@pytest.fixture()
def initialized_cursor(postgres_connection: Connection, request):
    cursor = postgres_connection.cursor(row_factory=dict_row)
    development = open("postgres/development.sql", "r").read()
    cursor.execute(development)
    request.addfinalizer(cursor.close)

    return cursor
