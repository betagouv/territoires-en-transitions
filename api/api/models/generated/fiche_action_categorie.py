from __future__ import annotations

from datetime import date
from typing import List, Literal, Optional
from pydantic import BaseModel


class FicheActionCategorie(BaseModel):
    epci_id: str
    uid: str
    plan_action_uids: List[str]
    parent_uid: str
    nom: str
    fiche_actions_uids: List[str]
