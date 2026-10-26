import { OrthancProvider, ProviderFactory, RepositoryFactory } from "@optica/core"
import { RotationRepository } from "./repositories/rotation_repository"

// Imported first by main.ts: the stores and components get the repository from the factories
ProviderFactory.register("ORTHANC", (url) => new OrthancProvider(url, "polaroptica"))
RepositoryFactory.register("DATA", (provider) => new RotationRepository(provider))

export function getRepository(): RotationRepository {
    return RepositoryFactory.get<RotationRepository>()
}
