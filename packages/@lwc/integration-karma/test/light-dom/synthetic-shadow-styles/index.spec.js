import { createElement } from 'lwc';
import Container from 'x/container';

// This test only matters for synthetic shadow
if (!process.env.NATIVE_SHADOW) {
    describe('Light DOM and synthetic shadow', () => {
        it('shadow scoping tokens are not set for light DOM components', () => {
            // shadow grandparent, light child, shadow grandchild
            const elm = createElement('x-container', { is: Container });
            document.body.appendChild(elm);

            // shadow grandparent
            expect(elm.shadowRoot.querySelector('h1').outerHTML).toMatch(
                process.env.API_VERSION <= 58 ? /\bx-container_container\b/ : /\blwc-[a-z0-9]+\b/
            );
            expect(getComputedStyle(elm.shadowRoot.querySelector('h1')).color).toEqual(
                'rgb(0, 128, 0)'
            );

            // light child
            const child = elm.shadowRoot.querySelector('x-light');
            expect(child.querySelector('h1').outerHTML).not.toContain('x-child_child');
            expect(getComputedStyle(child.querySelector('h1')).backgroundColor).toEqual(
                'rgb(255, 0, 0)'
            );

            // shadow grandchild
            const grandchild = child.querySelector('x-grandchild');
            expect(grandchild.shadowRoot.querySelector('h1').outerHTML).toMatch(
                process.env.API_VERSION <= 58 ? /\bx-grandchild_grandchild\b/ : /\blwc-[a-z0-9]+\b/
            );
            expect(
                getComputedStyle(grandchild.shadowRoot.querySelector('h1')).outlineColor
            ).toEqual('rgb(0, 255, 255)');
        });
    });
}
