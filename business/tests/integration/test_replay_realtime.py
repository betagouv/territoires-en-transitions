from typing import List

from business.domain.ports.domain_message_bus import (
    InMemoryDomainMessageBus,
)

from business.adapters.replay_realtime import ReplayRealtime
from business.domain.ports.realtime import (
    AbstractConverter,
    EpciActionStatutUpdateConverter,
)
from business.domain.models import events

from tests.utils.spy_on_event import spy_on_event


def test_domain_event_published_on_replay_correct_realtime_status_update_observer():
    bus = InMemoryDomainMessageBus()
    converters: List[AbstractConverter] = [EpciActionStatutUpdateConverter()]
    realtime = ReplayRealtime(bus, converters=converters)
    realtime.set_events_to_emit(
        [
            {
                "record": {
                    "referentiel": "eci",
                    "epci_id": 1,
                    "created_at": "2020-01-01T12",
                },
                "table": "epci_action_statut_update_event",
            }
        ]
    )
    failure_events = spy_on_event(bus, events.RealtimeEventWithWrongFormatObserved)
    corresponding_domain_events = spy_on_event(bus, events.ActionStatutUpdatedForEpci)

    realtime.start()

    assert len(failure_events) == 0
    assert len(corresponding_domain_events) == 1

    assert corresponding_domain_events[0] == events.ActionStatutUpdatedForEpci(
        epci_id=1, referentiel="eci", created_at="2020-01-01T12"
    )


def test_failure_published_when_realtime_event_has_unknown_referentiel():
    bus = InMemoryDomainMessageBus()
    converters: List[AbstractConverter] = [EpciActionStatutUpdateConverter()]
    realtime = ReplayRealtime(bus, converters=converters)

    realtime.set_events_to_emit(
        [
            {
                "record": {
                    "referentiel": "toto",
                    "epci_id": 1,
                    "created_at": "2020-01-01T12",
                },
                "table": "epci_action_statut_update_event",
            }
        ]
    )
    failure_events = spy_on_event(bus, events.RealtimeEventWithWrongFormatObserved)

    realtime.start()

    assert len(failure_events) == 1
    assert (
        failure_events[0].reason
        == "Realtime event with wrong format: {'referentiel': ['Must be one of: eci, cae.']}"
    )


def test_realtime_event_has_wrong_record_format():
    bus = InMemoryDomainMessageBus()
    converters: List[AbstractConverter] = [EpciActionStatutUpdateConverter()]
    realtime = ReplayRealtime(bus, converters=converters)

    realtime.set_events_to_emit(
        [
            {
                "record": {
                    "referentiel": "eci",
                    "created_at": "2020-01-01T12"
                    # "epci_id": 1,
                },
                "table": "epci_action_statut_update_event",
            }
        ]
    )

    failure_events = spy_on_event(bus, events.RealtimeEventWithWrongFormatObserved)

    realtime.start()

    assert len(failure_events) == 1

    assert (
        failure_events[0].reason
        == "Realtime event with wrong format: {'epci_id': ['Missing data for required field.']}"
    )
