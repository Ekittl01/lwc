const MULTI_SPACE = /\s+/g;

class ClassList {
    constructor(el) {
        this.el = el;
    }

    add(...newClassNames) {
        const className = this.el.className;
        const set = new Set(className.split(MULTI_SPACE).filter(Boolean));
        for (const newClassName of newClassNames) {
            set.add(newClassName);
        }
        this.el.className = Array.from(set).join(' ');
    }

    contains(className) {
        const currentClassNameStr = this.el.className;
        return new RegExp(`\\b${className}\\b`).test(currentClassNameStr);
    }

    remove(...deprecatedClassNames) {
        const className = this.el.className;
        const set = new Set(className.split(MULTI_SPACE).filter(Boolean));
        for (const newClassName of deprecatedClassNames) {
            set.delete(newClassName);
        }
        this.el.className = Array.from(set).join(' ');
    }

    replace(oldClassName, newClassName) {
        let classWasReplaced = false;
        const className = this.el.className;
        const listOfClasses = className.split(MULTI_SPACE).filter(Boolean);
        listOfClasses.forEach((value, idx) => {
            if (value === oldClassName) {
                classWasReplaced = true;
                listOfClasses[idx] = newClassName;
            }
        });
        this.el.className = listOfClasses.join(' ');
        return classWasReplaced;
    }

    toggle(classNameToToggle, force) {
        const classNameStr = this.el.className;
        const set = new Set(classNameStr.split(MULTI_SPACE).filter(Boolean));
        if (!set.has(classNameToToggle) && force !== false) {
            set.add(classNameToToggle);
        } else if (set.has(classNameToToggle) && force !== true) {
            set.remove(classNameToToggle);
        }
        this.el.className = Array.from(set).join(' ');
        return set.has(classNameToToggle);
    }
}

class LightningElement {
    constructor(propsAvailableAtConstruction) {
        Object.assign(this, propsAvailableAtConstruction);
        this.isConnected = false;
    }

    __internal__setState(props, reflectedProps, attrs) {
        Object.assign(this, props);
        this.__attrs = attrs;

        // Whenever a reflected prop changes, we'll update the original props object
        // that was passed in. That'll be referenced when the attrs are rendered later.
        for (const reflectedPropName of reflectedProps) {
            Object.defineProperty(this, reflectedPropName, {
                get() {
                    return props[reflectedPropName];
                },
                set(newValue) {
                    props[reflectedPropName] = newValue;
                },
                enumerable: true,
            });
        }

        Object.defineProperty(this, 'className', {
            get() {
                return props.class ?? '';
            },
            set(newVal) {
                props.class = newVal;
                attrs.class = newVal;
            },
        });
    }

    __classList = null;
    get classList() {
        if (this.__classList) {
            return this.__classList;
        }
        return (this.__classList = new ClassList(this));
    }

    getAttribute(attrName) {
        return this.__attrs[attrName];
    }
}

const escapeAttrVal = (attrVal) => attrVal.replaceAll('"', '&quot;').replaceAll('&', '&amp;');

function* renderAttrs(attrs) {
    if (!attrs) {
        return;
    }
    for (const [key, val] of Object.entries(attrs)) {
        if (val) {
            if (typeof val === 'string') {
                yield ` ${key}="${escapeAttrVal(val)}"`;
            } else {
                yield ` ${key}`;
            }
        }
    }
}

function* fallbackTmpl(_props, attrs, _slotted, Cmp, _instance) {
    if (Cmp.renderMode !== 'light') {
        yield '<template shadowroot="open">';
    }
    if (Cmp.renderMode !== 'light') {
        yield '</template>';
    }
}

// eslint-disable-next-line no-undef
module.exports = {
    LightningElement,
    fallbackTmpl,
    renderAttrs,
};
