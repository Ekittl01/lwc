import { esTemplate } from '../estemplate';
import type { ImportDeclaration as EsImportDeclaration } from 'estree';

export const bImportHtmlEscape = esTemplate<EsImportDeclaration>`
    import { htmlEscape } from '@lwc/shared';
`;
export const importHtmlEscapeKey = 'import:htmlEscape';

export function cleanStyleAttrVal(styleAttrVal: string): string {
    if (styleAttrVal.endsWith(';')) {
        styleAttrVal = styleAttrVal.slice(0, -1);
    }
    return styleAttrVal.trim();
}

const reservedKeywords = new Set([
    'NaN',
    'arguments',
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'enum',
    'eval',
    'export',
    'extends',
    'false',
    'finally',
    'for',
    'function',
    'if',
    'implements',
    'import',
    'in',
    'instanceof',
    'interface',
    'let',
    'new',
    'null',
    'package',
    'private',
    'protected',
    'public',
    'return',
    'static',
    'super',
    'switch',
    'this',
    'throw',
    'true',
    'try',
    'typeof',
    'undefined',
    'var',
    'void',
    'while',
    'with',
    'yield',
]);

const imperfectIdentifierMatcher = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;

export const isValidIdentifier = (str: string) =>
    !reservedKeywords.has(str) && imperfectIdentifierMatcher.test(str);
