import { generate } from 'astring';
import { is, builders as b } from 'estree-toolkit';
import { parse } from '@lwc/template-compiler';
import { esTemplate } from '../estemplate';
import { templateIrToEsTree } from './ir-to-es';
import type {
    Node as EsNode,
    Statement as EsStatement,
    Literal as EsLiteral,
    ExportDefaultDeclaration as EsExportDefaultDeclaration,
} from 'estree';

const isBool = (node: EsNode | null) => is.literal(node) && typeof node.value === 'boolean';

const bExportTemplate = esTemplate<
    EsExportDefaultDeclaration,
    [EsLiteral, EsStatement[], EsLiteral]
>`
    export default async function* tmpl(props, attrs, slotted, Cmp, instance, stylesheets) {
        if (!${isBool} && Cmp.renderMode !== 'light') {
            yield \`<template shadowroot="open"\${Cmp.delegatesFocus ? ' shadowrootdelegatesfocus' : ''}>\`
        }

        for (const stylesheet of stylesheets ?? []) {
            // TODO
            const token = null;
            const useActualHostSelector = true;
            const useNativeDirPseudoclass = null;
            yield '<style type="text/css">';
            yield stylesheet(token, useActualHostSelector, useNativeDirPseudoclass);
            yield '</style>';
        }

        ${is.statement};

        if (!${isBool} && Cmp.renderMode !== 'light') {
            yield '</template>'
        }
    }
`;

function optimizeAdjacentYieldStmts(statements: EsStatement[]): EsStatement[] {
    let prevStmt: EsStatement | null = null;
    return statements
        .map((stmt) => {
            if (
                // Check if the current statement and previous statement are
                // both yield expression statements that yield a string literal.
                prevStmt &&
                prevStmt.type === 'ExpressionStatement' &&
                prevStmt.expression.type === 'YieldExpression' &&
                !prevStmt.expression.delegate &&
                prevStmt.expression.argument &&
                prevStmt.expression.argument.type === 'Literal' &&
                typeof prevStmt.expression.argument.value === 'string' &&
                stmt.type === 'ExpressionStatement' &&
                stmt.expression.type === 'YieldExpression' &&
                !stmt.expression.delegate &&
                stmt.expression.argument &&
                stmt.expression.argument.type === 'Literal' &&
                typeof stmt.expression.argument.value === 'string'
            ) {
                prevStmt.expression.argument.value += stmt.expression.argument.value;
                return null;
            }
            prevStmt = stmt;
            return stmt;
        })
        .filter((el): el is NonNullable<EsStatement> => el !== null);
}

export default function compileTemplate(src: string, _filename: string) {
    const { root, warnings } = parse(src);
    if (!root || warnings.length) {
        for (const warning of warnings) {
            // eslint-disable-next-line no-console
            console.error('Cannot compile:', warning.message);
        }
        throw new Error('Template compilation failure; see warnings in the console.');
    }

    const tmplRenderMode =
        root!.directives.find((directive) => directive.name === 'RenderMode')?.value?.value ??
        'shadow';
    const astShadowModeBool = tmplRenderMode === 'light' ? b.literal(true) : b.literal(false);

    const preserveComments = !!root!.directives.find(
        (directive) => directive.name === 'PreserveComments'
    )?.value?.value;

    const { hoisted, statements } = templateIrToEsTree(root!, { preserveComments });

    const moduleBody = [
        ...hoisted,
        bExportTemplate(
            astShadowModeBool,
            optimizeAdjacentYieldStmts(statements),
            astShadowModeBool
        ),
    ];
    const program = b.program(moduleBody, 'module');

    return {
        code: generate(program, {}),
    };
}
