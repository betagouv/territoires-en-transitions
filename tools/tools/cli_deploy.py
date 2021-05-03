import os

import typer
from botocore.client import BaseClient

from tools.utils.s3 import make_s3_client

app = typer.Typer()


@app.command()
def upload_client(
        subdomain: str = typer.Option('sandbox', "--subdomain", "-s"),
        client_old: str = typer.Option('../client/dist', "--client-old", "-co"),
        client_new: str = typer.Option('../client_new/__sapper__/export', "--client-new", "-cn"),
) -> None:
    """Upload files into a sub domain bucket"""
    s3 = make_s3_client()
    bucket = f'{subdomain}.territoiresentransitions.fr'
    count = upload_folder(bucket, client_new, s3)
    typer.echo(f"Uploaded {count} files to '{bucket}'.")


def upload_folder(bucket: str, path: str, s3: BaseClient) -> int:
    count = 0
    filenames = []
    for root, dirs, files in os.walk(path):
        for filename in files:
            filenames.append(os.path.join(root, filename))

    typer.echo(f"Uploading {len(filenames)} files from {path} to '{bucket}'.")
    with typer.progressbar(filenames) as progress:
        for filename in progress:
            name = filename.lstrip(path)
            s3.upload_file(filename, bucket, name, ExtraArgs={'ACL': 'public-read'})
            count += 1
    return count
