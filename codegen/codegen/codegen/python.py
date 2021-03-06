"""Fonctions pour générer les classes et les objets python"""
import json
from typing import Any, List, Optional

from black import format_str, FileMode
from mistletoe import Document

from codegen.codegen.generator import parse_definitions
from codegen.utils.strings import camel_to_snake
from codegen.utils.templates import build_jinja_environment

template_file = "shared/python/classes.j2"


def types_python(type: str, options: Optional[List[Any]] = None) -> str:
    """Converts a type from yaml to a python type"""
    py_types = {
        "num": "float",
        "List": "list",
        "Dict": "dict",
        "Date": "date",
        "bool": "bool",
        "Optional[String]": "Optional[str]",
        None: "str",
    }
    if type in py_types.keys():
        return py_types[type]
    if type.startswith("List["):
        types = type.replace("List[", "").replace("]", "")
        params = ", ".join([types_python(t.strip()) for t in types.split(",")])
        return f"List[{params}]"
    if type == "String":
        if not options:
            return "str"
        else:
            options = [option or "" for option in options]  # Replace None by ""
            return f"Literal{str(options)}"
    return type


def fields_python(yaml_data: dict) -> dict:
    """Transform yaml class fields."""
    return {name: types_python(**properties) for name, properties in yaml_data.items()}


def classes_python(yaml_data: dict) -> dict:
    """Transform yaml class declaration into data suitable for the python classes template."""
    return {name: fields_python(fields) for name, fields in yaml_data.items()}


def render_template(template_file: str, data: dict) -> str:
    env = build_jinja_environment()
    template = env.get_template(template_file)
    classes = classes_python(data)
    rendered = template.render(classes=classes)
    return format_str(rendered, mode=FileMode())


def objects_py(yaml_data: dict) -> dict:
    """Transform yaml object declaration into template data."""
    return {name: json.dumps(obj, indent=4) for name, obj in yaml_data.items()}


def render_object(definition: dict, template_file="shared/python/objects.j2") -> str:
    env = build_jinja_environment()
    template = env.get_template(template_file)
    objects = objects_py(definition["yaml"])
    rendered = template.render(objects=objects, comments=definition["comments"])
    return format_str(rendered, mode=FileMode())


def yaml_to_python(definition: dict) -> tuple[str, str]:
    rendered = ""
    filename = ""

    data = definition["yaml"]

    if data:
        name = list(data.keys())[0]
        filename = camel_to_snake(name)

        # this a class
        if name[0].isupper():
            rendered = render_template(template_file, data)

        # this is an object.
        else:
            rendered = render_object(definition)

    return f"{filename}.py", rendered


def render_markdown_as_python(markdown: Document) -> List[tuple[str, str]]:
    parsed = parse_definitions(markdown)
    return [yaml_to_python(definition) for definition in parsed]
