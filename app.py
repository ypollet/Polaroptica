import os

from optica_core import Dataset, acquisition, create_app, image, project


class RotationDataset(Dataset):
    """Images of an object under polarized light rotated around it (rotation.json)."""

    manifest = "rotation.json"

    def images(self, id):
        rotation_file = self.load(id)
        folder = self.thumbnails_folder(id, rotation_file)
        images = []
        for name, data in rotation_file["rotation"].items():
            if "angle" not in data:
                print(f"{name} has no angle, skipped")
                continue
            images.append(image(
                name,
                angle=round(data["angle"], 1),
                hasThumbnail=self.has_thumbnail(folder, name),
            ))
        return project(acquisition(
            "rotation",
            size={"height": rotation_file["height"], "width": rotation_file["width"]},
            images=images,
        ))

    # all the images share the pixel ratio of the object
    def position(self, id, image_id, x, y):
        pixel_ratio = self.load(id)["PixelRatio"]
        return {"x": x * pixel_ratio[0], "y": y * pixel_ratio[1]}


# the series of the A09135 sample, $OPTICA_DATA_FOLDER overrides it
DATA_FOLDER = os.environ.get("OPTICA_DATA_FOLDER") or f"{os.getcwd()}/data/A09135"

app = create_app(RotationDataset, logo="Polaroptica", version="1.2.0", data_folder=DATA_FOLDER)


if __name__ == "__main__":
    app.run()
