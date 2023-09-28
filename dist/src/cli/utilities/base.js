"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const classParser_1 = __importDefault(require("../parsers/classParser"));
const dynamicParser_1 = __importDefault(require("../parsers/dynamicParser"));
function classCSS(classArray, baseStyle, config) {
    const finalBaseCSS = new Set();
    // Regex
    const dynamicStyleRegex = /-(?:\[([^\]]+)\])/g;
    const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g;
    try {
        classArray.forEach((className) => {
            if (baseStyle[className]) {
                var cssString = `.${className}{\n`;
                if (Array.isArray(baseStyle[className])) {
                    baseStyle[className].forEach((e, i, arr) => {
                        if ((i + 1) === arr.length) {
                            cssString += `\t${e}`;
                            cssString += '\n}';
                        }
                        else if (i + 1 !== arr.length) {
                            cssString += `\t${e}\n`;
                        }
                    });
                }
                else {
                    const value = baseStyle[className];
                    cssString += `\t${value}\n`;
                    cssString += '}';
                }
                finalBaseCSS.add(cssString);
            }
            else {
                // Here, we will most likely have a dynamic class or pseudoclass
                // Parse pseudoClasses & pseudoElements
                if (className.includes(':') || className.includes('::')) {
                    const parsedString = (0, classParser_1.default)(className, baseStyle);
                    if (parsedString) {
                        const { className, cssAttribute, name, value, pseudo, pseudoSeparator } = parsedString;
                        var cssString = `.${className}${pseudoSeparator}${pseudo}{\n`;
                        if (Array.isArray(cssAttribute)) {
                            cssAttribute.forEach((e, i, arr) => {
                                if ((i + 1) === arr.length) {
                                    cssString += `\t${e}`;
                                    cssString += '\n}';
                                }
                                else if (i + 1 !== arr.length) {
                                    cssString += `\t${e}\n`;
                                }
                            });
                        }
                        else {
                            cssString += `\t${cssAttribute}`;
                            cssString += '\n}';
                        }
                        finalBaseCSS.add(cssString);
                    }
                }
                // Parse Dynamic Classes
                if (className.match(dynamicStyleRegex)) {
                    const parsedString = (0, dynamicParser_1.default)(className);
                    if (parsedString) {
                        const { className, cssAttribute, name, value } = parsedString;
                        var cssString = `.${className}{\n`;
                        cssString += `\t${cssAttribute}`;
                        cssString += '\n}';
                        finalBaseCSS.add(cssString);
                    }
                }
            }
        });
    }
    catch (err) {
        console.log(`An error has occurred: ${err}`);
    }
    //console.log(finalBaseCSS);
    //console.log(config.output.replace('output.css', 'test.css'));
    const css = Array.from(finalBaseCSS).join('\n');
    return css;
}
exports.default = classCSS;
