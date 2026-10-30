import { parseAcquisitions, ProjectRepository, type AcquisitionObject, type DataProvider } from "optica-core"
import { RotationAcquisition, type RotationImage } from "../models/rotation"

// Reads the standard payload, or the one of the polaroptica backends not migrated yet (Orthanc plugin)
export function parseRotation(data: any): AcquisitionObject<RotationImage>[] {
    if (data.acquisitions) {
        return parseAcquisitions<RotationImage>(data)
    }
    return [{ id: "rotation", images: data.rotationImages, size: data.size }]
}

export class RotationRepository extends ProjectRepository<RotationImage, RotationAcquisition> {
    constructor(provider: DataProvider) {
        super(provider, parseRotation, (object) => new RotationAcquisition(object))
    }
}
