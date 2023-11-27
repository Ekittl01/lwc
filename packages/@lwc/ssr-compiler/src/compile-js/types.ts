import type { traverse } from 'estree-toolkit';
import type { Node } from 'estree';

export type Visitors = Parameters<typeof traverse<Node, ComponentMetaState>>[1];

export interface ComponentMetaState {
    isLWC: boolean;
    hasConstructor: boolean;
    hasConnectedCallback: boolean;
    hasRenderMethod: boolean;
    hadRenderedCallback: boolean;
    hadDisconnectedCallback: boolean;
    hadErrorCallback: boolean;
    lightningElementIdentifier: string | null;
    lwcClassName: string | null;
    tmplExplicitImports: Map<string, string> | null;
    cssExplicitImports: Map<string, string> | null;
    staticStylesheetIds: Set<string> | null;
    props: string[];
    reflectedPropsInPlay: Set<string>;
}
