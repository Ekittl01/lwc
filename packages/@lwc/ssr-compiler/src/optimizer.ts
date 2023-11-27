import type { Instruction } from './shared';

export function* optimize(instructions: Generator<Instruction>): Generator<Instruction> {
    yield* instructions;
}
