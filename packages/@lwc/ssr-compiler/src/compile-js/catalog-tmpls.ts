import type { NodePath } from 'estree-toolkit';
import type { ImportDeclaration } from 'estree';
import type { ComponentMetaState } from './types';

export function catalogTmplImport(path: NodePath<ImportDeclaration>, state: ComponentMetaState) {
    const specifier = path.node!.specifiers[0];

    if (
        typeof path.node!.source.value !== 'string' ||
        !path.node!.source.value!.endsWith('.html') ||
        path.node!.specifiers.length !== 1 ||
        specifier.type !== 'ImportDefaultSpecifier'
    ) {
        return;
    }

    state.tmplExplicitImports = state.tmplExplicitImports ?? new Map();
    state.tmplExplicitImports.set(specifier.local.name, path.node!.source.value);
}
