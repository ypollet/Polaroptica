import os

from optica_core import Dataset, acquisition, create_app, image, project


class RotationDataset(Dataset):
    """Images of an object under polarized light rotated around it (rotation.json)."""

    manifest = "rotation.json"
    viewer = "polaroptica"

    def images(self, id):
        manifest = self.load(id)
        folder = self.thumbnails_folder(id, manifest)
        acquisitions = []
        for rotation in manifest["acquisitions"]:
            images = []
            for entry in rotation["images"]:
                if "angle" not in entry:
                    print(f"{entry['file']} has no angle, skipped")
                    continue
                images.append(image(
                    entry["file"],
                    entry.get("label"),
                    angle=round(self.degrees(manifest, entry["angle"]), 1),
                    hasThumbnail=self.has_thumbnail(folder, entry["file"]),
                ))
            acquisitions.append(acquisition(rotation["id"], label=rotation.get("label"), size=rotation["size"], images=images))
        return project(*acquisitions, unit=manifest["unit"])

    # pixel size of the image, else of its acquisition; an uncalibrated image gives its pixel coordinates
    def position(self, id, image_id, x, y):
        pixel_size = self.pixel_size(*self.find_image(self.load(id), image_id)) or [1, 1]
        return {"x": x * pixel_size[0], "y": y * pixel_size[1]}


# the series of the A09135 sample, $OPTICA_DATA_FOLDER overrides it
DATA_FOLDER = os.environ.get("OPTICA_DATA_FOLDER") or f"{os.getcwd()}/data/A09135"

app = create_app(RotationDataset, logo="Polaroptica", version="1.2.0", data_folder=DATA_FOLDER)


if __name__ == "__main__":
    app.run()
