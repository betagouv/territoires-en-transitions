from __future__ import annotations

from datetime import date
from typing import List, Literal, Optional
from pydantic import BaseModel


class IndicateurValue(BaseModel):
    epci_id: str
    indicateur_id: str
    year: float
    value: float
