from datetime import datetime
import json
from typing import List

from dataclasses import asdict


from business.evaluation.domain.models.action_score import ActionScore
from business.evaluation.domain.ports.action_score_repo import (
    AbstractActionScoreRepository,
)
from business.utils.timeit import timeit

from business.utils.supabase_repo import SupabaseError, SupabaseRepository
from business.evaluation.adapters import supabase_table_names

from supabase.client import SupabaseQueryBuilder


class SupabaseActionScoreRepository(
    SupabaseRepository,
    AbstractActionScoreRepository,
):
    def add_entities_for_collectivite(
        self, collectivite_id: int, entities: List[ActionScore]
    ):
        if not entities:
            return

        referentiel = entities[0].referentiel
        client_scores_json = [asdict(score) for score in entities]

        insert_result = self.table.insert(  # type: ignore
            {
                "collectivite_id": collectivite_id,
                "referentiel": referentiel,
                "scores": client_scores_json,
                "score_created_at": self.get_now(),
            },
            upsert=True,
        ).execute()
        if insert_result["status_code"] not in [200, 201]:
            raise SupabaseError(
                f"Error with status code {insert_result.get('status_code')}.\n Data: "
                + json.dumps(insert_result.get("data"))
            )

    @property
    def table(self) -> SupabaseQueryBuilder:
        return self.supabase_client.table(supabase_table_names.client_scores)

    def get_now(self) -> str:
        return datetime.now().strftime("%m/%d/%Y %H:%M:%S")