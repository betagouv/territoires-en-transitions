import math
import pytest

from api.notation.referentiel import Referentiel
from api.notation.referentiels import referentiel_eci


def _points_error_message(referentiel: Referentiel, index: tuple) -> str:
    """Returns the error message that explains how parent points differ from the total of its children."""
    children = referentiel_eci.children(index)
    total_points = sum([referentiel_eci.points[child] for child in children])
    total_percentage = sum([referentiel_eci.percentages[child] for child in children])

    details = [
        f"{'.'.join(child)}={referentiel_eci.percentages[child]}% "
        for child in children
    ]

    return (
        f"Le total en pourcentage des {len(children)} enfants de {referentiel.actions[index].id} "
        f"n'est pas égal à 100% mais est égal à {total_percentage * 100}%. "
        f"Le total des points n'est pas de {referentiel.points[index]} mais est égal à {total_points}. "
        f"{details}."
    )


# we a generate a list of test cases in order to run them all and avoid failing early.
@pytest.mark.parametrize("index", referentiel_eci.backward)
def test_eci_action_points(index):
    """Test that an action points is equal to the total points of its children."""
    children = referentiel_eci.children(index)
    if children:
        total_points = sum([referentiel_eci.points[child] for child in children])
        assert math.isclose(
            total_points, referentiel_eci.points[index]
        ), _points_error_message(referentiel_eci, index)


def assert_referentiel_total_points_is_500(referentiel: Referentiel, name: str):
    total_points = referentiel.points[()]
    detailed_message_for_axes = "\n".join(
        [
            f"- L'axe {k} compte {referentiel.points.get((str(k),))} points;"
            for k in range(1, 7)
        ]
    )

    assert (
        total_points == 500
    ), f"La somme des points du référentiel {name} est de {total_points} au lieu de 500. --> {detailed_message_for_axes}"


def test_import_referentiel_eci():
    from api.notation.referentiels import referentiel_eci

    assert referentiel_eci
    assert_referentiel_total_points_is_500(referentiel_eci, "Economie Circulaire")


def test_import_referentiel_cae():
    from api.notation.referentiels import referentiel_cae

    assert referentiel_cae
    assert_referentiel_total_points_is_500(referentiel_cae, "Climat Air Energie")
