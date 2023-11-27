import { builders as b } from 'estree-toolkit';

import type { Comment as IrComment } from '@lwc/template-compiler';
import type { Transformer } from './types';

export const Comment: Transformer<IrComment> = function Comment(node, cxt) {
    if (cxt.templateOptions.preserveComments) {
        return [b.expressionStatement(b.yieldExpression(b.literal(`<!--${node.value}-->`)))];
    } else {
        return [];
    }
};
