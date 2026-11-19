"""The manifest schema of polaroptica (rotation.json), on top of the common one of optica_core."""

import copy
import glob
import json
import os

import pytest

pytest.importorskip("jsonschema")
from optica_core.schema import errors, validator  # noqa: E402

HERE = os.path.dirname(__file__)
SCHEMA = os.path.join(HERE, "..", "manifest.schema.json")
DATA = os.path.join(HERE, "..", "data")

EXAMPLE = {
    "format": "optica-manifest",
    "version": 1,
    "viewer": "polaroptica",
    "unit": "mm",
    "angleUnit": "deg",
    "acquisitions": [
        {
            "id": "rotation",
            "size": {
                "width": 490,
                "height": 490
            },
            "pixelSize": None,
            "images": [
                {
                    "file": "a01.jpg",
                    "angle": 0
                },
                {
                    "file": "a02.jpg",
                    "angle": 5
                }
            ]
        }
    ]
}


@pytest.fixture(scope="module")
def check():
    return validator(SCHEMA)


def test_example(check):
    assert errors(check, EXAMPLE) == []


def no_angle_unit(manifest):
    del manifest["angleUnit"]


def an_image_without_angle(manifest):
    del manifest["acquisitions"][0]["images"][0]["angle"]


@pytest.mark.parametrize("mistake", [
    no_angle_unit,
    an_image_without_angle,
])
def test_mistakes_are_refused(check, mistake):
    manifest = copy.deepcopy(EXAMPLE)
    mistake(manifest)
    assert errors(check, manifest) != []


# the manifests of the data folder, when there is one (it isn't in git)
@pytest.mark.parametrize("path", sorted(glob.glob(os.path.join(DATA, "**", "rotation.json"), recursive=True)) or [None])
def test_data(check, path):
    if path is None:
        pytest.skip("no rotation.json in data/")
    with open(path) as f:
        assert errors(check, json.load(f)) == []
