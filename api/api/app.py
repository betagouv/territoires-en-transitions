from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tortoise.contrib.fastapi import register_tortoise

from api.config import openapi_config, tortoise_config
from api.routers.v2 import (
    auth,
    epci,
    indicateur_personnalise_objectif,
    utilisateur_droits,
    indicateur_personnalise_resultat,
    indicateur_personnalise,
    indicateur_resultat,
    indicateur_objectif,
    fiche_action,
    indicateur_referentiel_commentaire,
    action_status,
    fiche_action_categorie,
    action_meta,
    notation,
    plan_action,
    admin,
    statistics,
)

app = FastAPI(
    title=openapi_config.name,
    version=openapi_config.version,
    description=openapi_config.description,
)
app.include_router(action_status.router)
app.include_router(fiche_action.router)
app.include_router(fiche_action_categorie.router)
app.include_router(indicateur_referentiel_commentaire.router)
app.include_router(auth.router)
app.include_router(utilisateur_droits.router)
app.include_router(epci.router)
app.include_router(indicateur_personnalise_resultat.router)
app.include_router(indicateur_personnalise_objectif.router)
app.include_router(indicateur_personnalise.router)
app.include_router(indicateur_resultat.router)
app.include_router(indicateur_objectif.router)
app.include_router(action_meta.router)
app.include_router(notation.router)
app.include_router(plan_action.router)
app.include_router(admin.router)
app.include_router(statistics.router)

register_tortoise(
    app,
    db_url=tortoise_config.db_url,
    generate_schemas=tortoise_config.generate_schemas,
    modules=tortoise_config.modules,
)

app.add_middleware(
    CORSMiddleware,
    # FIXME not safe
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
