import type { Instruction } from './shared';
import type { Program } from 'estree';

export function bytecodeToEsTree(_instructions: Generator<Instruction>): Program {
    return {
        type: 'Program',
        body: [],
        sourceType: 'module',
    };
}
