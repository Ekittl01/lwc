import { builders as b } from 'estree-toolkit';

import type { ImportDeclaration } from 'estree';
import type { NodePath } from 'estree-toolkit';
import type { ComponentMetaState } from './types';

export function replaceLwcImport(path: NodePath<ImportDeclaration>, state: ComponentMetaState) {
    if (path.node!.source.value !== 'lwc') {
        return;
    }

    const node = path.node!;
    for (const specifier of node.specifiers) {
        if (
            specifier.type === 'ImportSpecifier' &&
            specifier.imported.type === 'Identifier' &&
            specifier.imported.name === 'LightningElement'
        ) {
            state.lightningElementIdentifier = specifier.local.name;
            break;
        }
    }

    path.replaceWith(b.importDeclaration(node.specifiers, b.literal('@lwc/ssr-compiler/runtime')));
}
