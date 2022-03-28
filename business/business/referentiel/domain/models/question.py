from dataclasses import dataclass
from typing import List, Optional
from typing import Literal

from business.utils.action_id import ActionId


@dataclass
class Choix:
    id: str
    formulation: str
    ordonnancement: Optional[int]


QuestionType = Literal["choix", "binaire", "proportion"]

CollectiviteType = Literal["EPCI", "commune"]


@dataclass
class Question:
    id: str
    formulation: str
    description: str
    thematique_id: str
    action_ids: List[ActionId]
    type: QuestionType
    ordonnnancement: Optional[int]
    types_collectivites_concernees: Optional[List[CollectiviteType]]
    choix: Optional[List[Choix]] = None

    @classmethod
    def from_dict(cls, d: dict) -> "Question":
        return cls(
            id=d["id"],
            formulation=d["formulation"],
            type=d["type"],
            description=d["description"],
            thematique_id=d["thematique_id"],
            action_ids=[ActionId(action_id) for action_id in d["action_ids"]],
            choix=[Choix(**choix) for choix in d["choix"]],
            ordonnnancement=d["ordonnnancement"],
            types_collectivites_concernees=d["types_collectivites_concernees"],
        )

    @dataclass
    class EngineQuestion:
        id: str
        type: QuestionType
        choix_ids: List[str]
