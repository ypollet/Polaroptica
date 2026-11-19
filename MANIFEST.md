# Polaroptica manifest: `rotation.json`

The fields polaroptica adds to the common manifest ([core/MANIFEST.md](../core/MANIFEST.md)). The JSON Schema is [`manifest.schema.json`](manifest.schema.json).

`images` are the images taken while the polarizers rotate, each at its `angle` in `angleUnit`.

```jsonc
"images": [{ "file": "isrnbel001_r1_ppl01.jpg", "angle": 0 }, { "file": "isrnbel001_r1_ppl02.jpg", "angle": 5 }]
```

Check a manifest (the tests in `tests/test_manifest.py` check every manifest of `data/`):

```bash
python -m optica_core.schema manifest.schema.json data/<object>/rotation.json
```
