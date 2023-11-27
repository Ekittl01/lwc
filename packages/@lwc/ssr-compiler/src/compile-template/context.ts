import type { ModuleDeclaration as EsModuleDeclaration, Statement as EsStatement } from 'estree';
import type { TemplateOpts, TransformerContext } from './types';

function* reversed<T>(arr: T[]): Generator<T> {
    for (let idx = arr.length - 1; idx > -1; idx--) {
        yield arr[idx];
    }
}

const identifierChars = 'abcdefghijklmnopqrstuvwxyz';

function genId(n: number, prevChars = ''): string {
    const remaining = Math.floor(n / identifierChars.length);
    const result = identifierChars.charAt(n % identifierChars.length) + prevChars;

    return remaining <= 0 ? result : genId(remaining - 1, result);
}

function* genIds() {
    let counter = 0;
    while (true) {
        yield genId(counter++);
    }
}

export interface ContextOpts {
    preserveComments: boolean;
}

export function createNewContext(templateOptions: TemplateOpts): {
    hoisted: Map<string, EsStatement | EsModuleDeclaration>;
    cxt: TransformerContext;
} {
    const hoisted = new Map<string, EsStatement | EsModuleDeclaration>();
    const hoist = (stmt: EsStatement | EsModuleDeclaration, dedupeKey: string) =>
        hoisted.set(dedupeKey, stmt);

    const localVarStack: Set<string>[] = [];

    const pushLocalVars = (vars: string[]) => {
        localVarStack.push(new Set(vars));
    };
    const popLocalVars = () => {
        localVarStack.pop();
    };
    const isLocalVar = (varName: string | null | undefined) => {
        if (!varName) {
            return false;
        }
        for (const stackFrame of reversed(localVarStack)) {
            if (stackFrame.has(varName)) {
                return true;
            }
        }
        return false;
    };

    const uniqueVarGenerator = genIds();
    const getUniqueVar = () => uniqueVarGenerator.next().value!;

    return {
        hoisted,
        cxt: {
            hoist,
            pushLocalVars,
            popLocalVars,
            isLocalVar,
            getUniqueVar,
            templateOptions,
        },
    };
}
