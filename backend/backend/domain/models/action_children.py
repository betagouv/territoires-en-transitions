from typing import List, Optional

from dataclasses import dataclass

from backend.domain.models.litterals import ActionId


@dataclass
class ActionChildren:
    action_id: ActionId
    children_ids: List[ActionId]
