import { DeepJson } from '@/common/libs'
import { ValueTransformer } from 'typeorm'

export type Bit = 0 | 1

export class JsonParserTransformer<T> implements ValueTransformer {
	// To db from typeorm
	public from(value?: string | null): T | Array<T> {
		return DeepJson.parse<T>(value)
	}

	public to(value?: string): string {
		return DeepJson.stringify(value)
	}
}
