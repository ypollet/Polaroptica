import { parseAcquisitions, ProjectRepository, type DataProvider } from "optica-core"
import { RotationAcquisition, type RotationImage } from "../models/rotation"

export class RotationRepository extends ProjectRepository<RotationImage, RotationAcquisition> {
    constructor(provider: DataProvider) {
        super(provider, parseAcquisitions, (object) => new RotationAcquisition(object))
    }
}
