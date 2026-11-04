import {
    Acquisition, Annotations, BoundingBox, Distance, imageRef, is3D, Landmark, Polygon, type ImageRef, type ProjectImage,
    LANDMARK_CSV_HEADER, POSE_CSV_HEADER, POSITION_CSV_HEADER, SCALED_POSITION_CSV_HEADER,
} from "optica-core"

// Image taken with the polarizer at `angle` degrees
export type RotationImage = ProjectImage & {
    angle: number
}

// angle of the image the landmark is placed on, kept in the details of its reference
export function angleOf(landmark: Landmark): number {
    return Number(landmark.pose.image.details?.angle)
}

export const IMAGE_DETAILS_CSV_HEADER = ["Angle"]

export const POLAR_CSV_HEADER = [...LANDMARK_CSV_HEADER, ...POSE_CSV_HEADER, ...IMAGE_DETAILS_CSV_HEADER, ...POSITION_CSV_HEADER, ...SCALED_POSITION_CSV_HEADER]

// one CSV row (POLAR_CSV_HEADER), `group`: label of the distance of the landmark
export function polarCSVRow(type: string, group: string, landmark: Landmark): string[] {
    const { marker, image } = landmark.pose
    const position = landmark.position
    return [type, group, landmark.label, landmark.getColorHEX(), marker.x.toFixed(5).toString(), marker.y.toFixed(5).toString(),
        image.name, image.label, image.details?.angle?.toString() ?? "", position.x.toFixed(5).toString(), position.y.toFixed(5).toString(), is3D(position) ? position.z.toFixed(5).toString() : ""]
}

// The rotation: browsing wraps around 360°
export class RotationAcquisition extends Acquisition<RotationImage> {
    declare annotations: PolarAnnotations

    protected createAnnotations(): PolarAnnotations {
        return new PolarAnnotations()
    }

    // angle of the shown image, -1 without image
    get angle(): number {
        return this.selectedImage?.angle ?? -1
    }

    // rounded angle -> index of its image
    get anglesMap(): Map<number, number> {
        return new Map(this.images.map((image, index) => [Math.round(image.angle), index]))
    }

    // steps of the circular slider
    get angleSteps(): Set<number> {
        return new Set(this.images.map((image) => Math.round(image.angle)))
    }

    setIndex(index: number) {
        if (!this.hasGroup) {
            return
        }
        this.standalone = null
        this.index = ((index % this.images.length) + this.images.length) % this.images.length
    }

    goToAngle(angle: number) {
        const index = this.anglesMap.get(Math.round(angle))
        if (index !== undefined) {
            this.setIndex(index)
        }
    }
}

// Annotations of the rotation: a distance, polygon or box is measured on one image, all its landmarks
// share the angle of the first one
export class PolarAnnotations extends Annotations {
    // a distance, polygon or box is measured on the images of one angle
    singleImageMeasures = true

    imageKey(image: ImageRef): number {
        return Math.round(Number(imageRef(image).details?.angle))
    }

    // angle of the distance, polygon or box, null while it has no landmark
    angleOf(measure: Distance | Polygon | BoundingBox): number | null {
        const first = measure.landmarks[0]
        return first ? angleOf(first) : null
    }

    // Adding RotationAngle
    csvHeader(): string[] {
        return POLAR_CSV_HEADER
    }

    toCSVRows(): string[][] {
        const row = (type: string, group: string, landmark: Landmark) => [...polarCSVRow(type, group, landmark), ...this.scaledPositionCSV(landmark)]
        return [
            ...this.landmarks.map((landmark) => row("Landmark", "", landmark)),
            ...this.distances.flatMap((distance) => distance.landmarks.map((landmark) => row("Distance", distance.label, landmark))),
            ...this.polygons.flatMap((polygon) => polygon.landmarks.map((landmark) => row("Polygon", polygon.label, landmark))),
            ...this.boxes.flatMap((box) => box.landmarks.map((landmark) => row("Box", box.label, landmark))),
        ]
    }
}
