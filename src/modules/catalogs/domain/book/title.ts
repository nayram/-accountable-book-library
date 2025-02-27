import { createString } from "@modules/shared/core/domain/value-objects/string"

export type Title = string

export function createTitle(value: string): Title {
    return createString(value, 'title')
}
