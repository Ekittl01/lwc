import { is } from 'estree-toolkit';

import type { Node } from 'estree';
import type { Validator } from '../estemplate';

export const isNullOrInstantiation = (node: Node | null) =>
    (is.literal(node) && node.value === null) || is.newExpression(node);

export const isStringLiteral = (node: Node | null) =>
    is.literal(node) && typeof node.value === 'string';

export const isIdentOrRenderCall = (node: Node | null) =>
    is.identifier(node) ||
    (is.callExpression(node) &&
        is.memberExpression(node.callee) &&
        is.identifier(node.callee.property) &&
        node.callee.property.name === 'render');

export function isNullableOf(validator: Validator) {
    return (node: Node | null) => node === null || (validator && validator(node));
}
