import {
    Acquisition, Annotations, Distance, is3D, Landmark, type ProjectImage,
    LANDMARK_CSV_HEADER, POSE_CSV_HEADER, POSITION_CSV_HEADER,
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

export const POLAR_CSV_HEADER = [...LANDMARK_CSV_HEADER, ...POSE_CSV_HEADER, ...IMAGE_DETAILS_CSV_HEADER, ...POSITION_CSV_HEADER]

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

// Annotations of the rotation: a distance is measured on one image, all its landmarks
// share the angle of the first one
export class PolarAnnotations extends Annotations {
    // angle of the distance, null while it has no landmark
    angleOf(distance: Distance): number | null {
        const first = distance.landmarks[0]
        return first ? angleOf(first) : null
    }

    // true if a landmark of the distance can be placed on an image with this angle
    acceptsAngle(distance: Distance, angle: number): boolean {
        const own = this.angleOf(distance)
        return own == null || Math.round(own) == Math.round(angle)
    }

    // a landmark of a distance fixed on another angle can't be moved there
    canMoveTo(landmark: Landmark, angle: number): boolean {
        const distance = this.distanceOf(landmark)
        return distance ? this.acceptsAngle(distance, angle) : true 
    }

    // Adding RotationAngle
    csvHeader(): string[] {
        return POLAR_CSV_HEADER
    }

    toCSVRows(): string[][] {
        return [
            ...this.landmarks.map((landmark) => polarCSVRow("Landmark", "", landmark)),
            ...this.distances.flatMap((distance) => distance.landmarks.map((landmark) => polarCSVRow("Distance", distance.label, landmark))),
        ]
    }
}
