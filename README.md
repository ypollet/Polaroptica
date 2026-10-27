# Polaroptica (core)

Polaroptica rebuilt on [`core/`](../core): the viewers, landmark and distance lists, menu, models and data layer come from `optica-core` and `optica_core`; this folder only keeps what is specific to rotated polarized light.

- `src/data/models/rotation.ts`: `RotationImage` (an image with its angle), `RotationAcquisition` (wraps around 360°, angle → image), `PolarDistance` (all its landmarks on the same angle).
- `src/lib/stores.ts`: the project, the annotations and the settings.
- `src/components/`: the circular slider, the logos, the sidebar, the viewer and the menu wiring.
- `app.py`: the `rotation.json` adapter of the common API.

## Run

```bash
# backend, series in ./data/A09135/<id>/rotation.json ($OPTICA_DATA_FOLDER to use another folder)
python -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/flask --app app run --port 5000

# frontend (http://localhost:5173/?series=isrnbel001_r1_xpl)
npm install
npm run dev
```

`.env` selects the backend (`VITE_BACKEND_TYPE=WEB|ORTHANC`, `VITE_BACKEND_URL`).
