# coding: utf-8

from __future__ import annotations
from datetime import date, datetime  # noqa: F401

import re  # noqa: F401
from typing import Any, Dict, List, Optional  # noqa: F401

from pydantic import AnyUrl, BaseModel, EmailStr, validator  # noqa: F401


class ViewEpci(BaseModel):
    """NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).

    Do not edit the class manually.

    ViewEpci - a model defined in OpenAPI

        siren: The siren of this ViewEpci [Optional].
        nom: The nom of this ViewEpci [Optional].
    """

    siren: Optional[str] = None
    nom: Optional[str] = None

    @validator("nom")
    def nom_max_length(cls, value):
        assert len(value) <= 300
        return value


ViewEpci.update_forward_refs()
