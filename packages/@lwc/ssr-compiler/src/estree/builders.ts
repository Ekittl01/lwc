import { is } from 'estree-toolkit';
import { esTemplate } from '../estemplate';
import { isStringLiteral } from './validators';

import type { ImportDeclaration, NewExpression } from 'estree';

export const bImportDeclaration = esTemplate<ImportDeclaration>`
    import ${is.identifier} from "${isStringLiteral}";
`;

export const bInstantiate = esTemplate<NewExpression>`new ${is.identifier}()`;
