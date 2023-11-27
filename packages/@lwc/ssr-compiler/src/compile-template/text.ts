import { builders as b, is } from 'estree-toolkit';
import { esTemplate } from '../estemplate';
import { bImportHtmlEscape, importHtmlEscapeKey } from './shared';
import { expressionIrToEs } from './expression';

import type {
    Expression as EsExpression,
    Statement as EsStatement,
    ConditionalExpression as EsConditionalExpression,
} from 'estree';
import type {
    ComplexExpression as IrComplexExpression,
    Expression as IrExpression,
    Literal as IrLiteral,
    Text as IrText,
} from '@lwc/template-compiler';
import type { Transformer } from './types';

const bYield = (expr: EsExpression) => b.expressionStatement(b.yieldExpression(expr));
const bEscapedString = esTemplate<EsConditionalExpression, [EsExpression, EsExpression]>`
    ${is.expression} === '' ? '\\u200D' : htmlEscape(${is.expression} ?? '__UNEXPECTED_NULLISH_TEXT_CONTENT__')
`;

function isLiteral(node: IrLiteral | IrExpression | IrComplexExpression): node is IrLiteral {
    return node.type === 'Literal';
}

export const Text: Transformer<IrText> = function Text(node, cxt): EsStatement[] {
    if (isLiteral(node.value)) {
        return [bYield(b.literal(node.value.value))];
    }

    const valueToYield = expressionIrToEs(node.value, cxt);
    cxt.hoist(bImportHtmlEscape(), importHtmlEscapeKey);
    return [bYield(bEscapedString(valueToYield, valueToYield))];
};
