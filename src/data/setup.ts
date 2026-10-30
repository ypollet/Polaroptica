import { coreProviders, createProvider } from "optica-core"
import { RotationRepository } from "./repositories/rotation_repository"

// Imported first by main.ts. The backend is the one of the environment (.env: VITE_BACKEND_TYPE, VITE_BACKEND_URL)
const repository = new RotationRepository(createProvider(coreProviders("polaroptica")))

export function getRepository(): RotationRepository {
    return repository
}
