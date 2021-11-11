# Code generated by jtd-codegen for Python v0.3.1

import re
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union, get_args, get_origin


@dataclass
class ScoreWrite:
    action_id: "str"
    completed_taches_count: "int"
    concernee: "bool"
    epci_id: "int"
    points: "float"
    potentiel: "float"
    previsionnel: "float"
    referentiel_points: "float"
    total_taches_count: "int"

    @classmethod
    def from_json_data(cls, data: Any) -> "ScoreWrite":
        return cls(
            _from_json_data(str, data.get("action_id")),
            _from_json_data(int, data.get("completed_taches_count")),
            _from_json_data(bool, data.get("concernee")),
            _from_json_data(int, data.get("epci_id")),
            _from_json_data(float, data.get("points")),
            _from_json_data(float, data.get("potentiel")),
            _from_json_data(float, data.get("previsionnel")),
            _from_json_data(float, data.get("referentiel_points")),
            _from_json_data(int, data.get("total_taches_count")),
        )

    def to_json_data(self) -> Any:
        data: Dict[str, Any] = {}
        data["action_id"] = _to_json_data(self.action_id)
        data["completed_taches_count"] = _to_json_data(self.completed_taches_count)
        data["concernee"] = _to_json_data(self.concernee)
        data["epci_id"] = _to_json_data(self.epci_id)
        data["points"] = _to_json_data(self.points)
        data["potentiel"] = _to_json_data(self.potentiel)
        data["previsionnel"] = _to_json_data(self.previsionnel)
        data["referentiel_points"] = _to_json_data(self.referentiel_points)
        data["total_taches_count"] = _to_json_data(self.total_taches_count)
        return data


def _from_json_data(cls: Any, data: Any) -> Any:
    if data is None or cls in [bool, int, float, str, object] or cls is Any:
        return data
    if cls is datetime:
        return _parse_rfc3339(data)
    if get_origin(cls) is Union:
        return _from_json_data(get_args(cls)[0], data)
    if get_origin(cls) is list:
        return [_from_json_data(get_args(cls)[0], d) for d in data]
    if get_origin(cls) is dict:
        return {k: _from_json_data(get_args(cls)[1], v) for k, v in data.items()}
    return cls.from_json_data(data)


def _to_json_data(data: Any) -> Any:
    if data is None or type(data) in [bool, int, float, str, object]:
        return data
    if type(data) is datetime:
        return data.isoformat()
    if type(data) is list:
        return [_to_json_data(d) for d in data]
    if type(data) is dict:
        return {k: _to_json_data(v) for k, v in data.items()}
    return data.to_json_data()


def _parse_rfc3339(s: str) -> datetime:
    datetime_re = "^(\d{4})-(\d{2})-(\d{2})[tT](\d{2}):(\d{2}):(\d{2})(\.\d+)?([zZ]|((\+|-)(\d{2}):(\d{2})))$"
    match = re.match(datetime_re, s)
    if not match:
        raise ValueError("Invalid RFC3339 date/time", s)

    (year, month, day, hour, minute, second, frac_seconds, offset, *tz) = match.groups()

    frac_seconds_parsed = None
    if frac_seconds:
        frac_seconds_parsed = int(float(frac_seconds) * 1_000_000)
    else:
        frac_seconds_parsed = 0

    tzinfo = None
    if offset == "Z":
        tzinfo = timezone.utc
    else:
        hours = int(tz[2])
        minutes = int(tz[3])
        sign = 1 if tz[1] == "+" else -1

        if minutes not in range(60):
            raise ValueError("minute offset must be in 0..59")

        tzinfo = timezone(timedelta(minutes=sign * (60 * hours + minutes)))

    second_parsed = int(second)
    if second_parsed == 60:
        second_parsed = 59

    return datetime(
        int(year),
        int(month),
        int(day),
        int(hour),
        int(minute),
        second_parsed,
        frac_seconds_parsed,
        tzinfo,
    )
