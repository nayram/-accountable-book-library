import { createString } from "@modules/shared/core/domain/value-objects/string"

export type Author = string

export function createAuthor(value: string): Author {
    return createString(value, 'author')
}
