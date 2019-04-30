/* eslint-disable max-len */

interface FeatureAll
{
    /**
     * Features available in Android Browser 4.0.
     */
    ANDRO_4_0: Feature;

    /**
     * Features available in Android Browser 4.1 to 4.3.
     */
    ANDRO_4_1: Feature;

    /**
     * Features available in Android Browser 4.4.
     */
    ANDRO_4_4: Feature;

    /**
     * Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.
     */
    ANY_DOCUMENT: Feature;

    /**
     * Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.
     */
    ANY_WINDOW: Feature;

    /**
     * The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 0.12+.
     */
    ARRAY_ITERATOR: Feature;

    /**
     * Support for arrow functions.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari 10+, Opera and Node.js 4+.
     */
    ARROW: Feature;

    /**
     * Existence of the global functions atob and btoa.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari before 10.
     */
    ATOB: Feature;

    /**
     * All features available in the current engine.
     */
    AUTO: Feature;

    /**
     * Existence of the global object statusbar having the string representation "\[object BarProp\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.
     */
    BARPROP: Feature;

    /**
     * Features available in all browsers.
     *
     * No support for Node.js.
     */
    BROWSER: Feature;

    /**
     * The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.
     *
     * @reamarks
     *
     * Available in Internet Explorer.
     */
    CAPITAL_HTML: Feature;

    /** An alias for `CHROME_73`. */
    CHROME: Feature;

    /**
     * Features available in Chrome 73 and Opera 60 or later.
     */
    CHROME_73: Feature;

    /** An alias for `CHROME_73`. */
    CHROME_PREV: Feature;

    /**
     * All new browsers' features.
     *
     * No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.
     */
    COMPACT: Feature;

    /**
     * Existence of the global object console having the string representation "\[object Console\]".
     *
     * This feature may become unavailable when certain browser extensions are active.
     *
     * @reamarks
     *
     * Available in Firefox, Internet Explorer 10+, Safari and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.
     */
    CONSOLE: Feature;

    /**
     * Minimum feature level, compatible with all supported engines in all environments.
     */
    DEFAULT: Feature;

    /**
     * Existence of the global object document having the string representation "\[object Document\]".
     *
     * @reamarks
     *
     * Available in Internet Explorer before 11. This feature is not available inside web workers.
     */
    DOCUMENT: Feature;

    /**
     * Existence of the global object self having the string representation "\[object DOMWindow\]".
     *
     * @reamarks
     *
     * Available in Android Browser before 4.4. This feature is not available inside web workers.
     */
    DOMWINDOW: Feature;

    /** An alias for `EDGE_40`. */
    EDGE: Feature;

    /**
     * Features available in Edge 40 or later.
     */
    EDGE_40: Feature;

    /** An alias for `EDGE_40`. */
    EDGE_PREV: Feature;

    /**
     * The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.
     *
     * @reamarks
     *
     * Available in Android Browser and Node.js before 0.12.
     */
    ESC_HTML_ALL: Feature;

    /**
     * The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.
     */
    ESC_HTML_QUOT: Feature;

    /**
     * The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera and Node.js 0.12+.
     */
    ESC_HTML_QUOT_ONLY: Feature;

    /**
     * Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 12+.
     */
    ESC_REGEXP_LF: Feature;

    /**
     * Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Node.js 4+.
     */
    ESC_REGEXP_SLASH: Feature;

    /**
     * Existence of the global object sidebar having the string representation "\[object External\]".
     *
     * @reamarks
     *
     * Available in Firefox. This feature is not available inside web workers.
     */
    EXTERNAL: Feature;

    /** An alias for `FF_62`. */
    FF: Feature;

    /**
     * Features available in Firefox 54 or later.
     */
    FF_54: Feature;

    /**
     * Features available in Firefox 62 or later.
     */
    FF_62: Feature;

    /** An alias for `FF_54`. */
    FF_ESR: Feature;

    /**
     * A string representation of native functions typical for Firefox and Safari.
     *
     * Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
     *
     * @reamarks
     *
     * Available in Firefox and Safari.
     */
    FF_SRC: Feature;

    /**
     * Existence of the native function Array.prototype.fill.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari 7.1+, Opera and Node.js 4+.
     */
    FILL: Feature;

    /**
     * Existence of the native function Array.prototype.flat.
     *
     * @reamarks
     *
     * Available in Chrome, Firefox 62+, Safari 12+, Opera and Node.js 11+.
     */
    FLAT: Feature;

    /**
     * Existence of the function String.fromCodePoint.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 4+.
     */
    FROM_CODE_POINT: Feature;

    /**
     * A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Opera and Node.js 10+.
     */
    FUNCTION_19_LF: Feature;

    /**
     * A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).
     *
     * @reamarks
     *
     * Available in Internet Explorer, Safari 9+, Android Browser and Node.js before 10.
     */
    FUNCTION_22_LF: Feature;

    /**
     * Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).
     *
     * The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser and Node.js.
     */
    GMT: Feature;

    /**
     * Existence of the global object history having the string representation "\[object History\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.
     */
    HISTORY: Feature;

    /**
     * Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".
     *
     * @reamarks
     *
     * Available in Android Browser 4.4. This feature is not available inside web workers.
     */
    HTMLAUDIOELEMENT: Feature;

    /**
     * Existence of the global object document having the string representation "\[object HTMLDocument\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera and Android Browser. This feature is not available inside web workers.
     */
    HTMLDOCUMENT: Feature;

    /**
     * Features available in Internet Explorer 10.
     */
    IE_10: Feature;

    /**
     * Features available in Internet Explorer 11.
     */
    IE_11: Feature;

    /**
     * Features available in Internet Explorer 11 on Windows 10.
     */
    IE_11_WIN_10: Feature;

    /**
     * Features available in Internet Explorer 9.
     */
    IE_9: Feature;

    /**
     * A string representation of native functions typical for Internet Explorer.
     *
     * Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
     *
     * @reamarks
     *
     * Available in Internet Explorer.
     */
    IE_SRC: Feature;

    /**
     * The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera and Node.js 5+.
     */
    INCR_CHAR: Feature;

    /**
     * Existence of the global object Intl.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.
     */
    INTL: Feature;

    /**
     * Language sensitive string representation of Infinity as "∞".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4 and Node.js 0.12+.
     */
    LOCALE_INFINITY: Feature;

    /**
     * Existence of the name property for functions.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.
     */
    NAME: Feature;

    /**
     * Existence of the global object Node having the string representation "\[object NodeConstructor\]".
     *
     * @reamarks
     *
     * Available in Safari before 10. This feature is not available inside web workers.
     */
    NODECONSTRUCTOR: Feature;

    /**
     * Features available in Node.js 0.10.
     */
    NODE_0_10: Feature;

    /**
     * Features available in Node.js 0.12.
     */
    NODE_0_12: Feature;

    /**
     * Features available in Node.js 10.
     */
    NODE_10: Feature;

    /**
     * Features available in Node.js 11.
     */
    NODE_11: Feature;

    /**
     * Features available in Node.js 12 or later.
     */
    NODE_12: Feature;

    /**
     * Features available in Node.js 4.
     */
    NODE_4: Feature;

    /**
     * Features available in Node.js 5 to 9.
     */
    NODE_5: Feature;

    /**
     * A string representation of native functions typical for V8 and Edge or for Internet Explorer but not for Firefox and Safari.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Internet Explorer, Opera, Android Browser and Node.js.
     */
    NO_FF_SRC: Feature;

    /**
     * A string representation of native functions typical for most engines with the notable exception of Internet Explorer.
     *
     * A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser and Node.js.
     */
    NO_IE_SRC: Feature;

    /**
     * The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Safari 9+, Opera and Node.js 0.12+.
     */
    NO_OLD_SAFARI_ARRAY_ITERATOR: Feature;

    /**
     * A string representation of native functions typical for Firefox, Internet Explorer and Safari.
     *
     * A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
     *
     * @reamarks
     *
     * Available in Firefox, Internet Explorer and Safari.
     */
    NO_V8_SRC: Feature;

    /** An alias for `SAFARI_12`. */
    SAFARI: Feature;

    /**
     * Features available in Safari 10 or later.
     */
    SAFARI_10: Feature;

    /**
     * Features available in Safari 12 or later.
     */
    SAFARI_12: Feature;

    /**
     * Features available in Safari 7.0.
     */
    SAFARI_7_0: Feature;

    /**
     * Features available in Safari 7.1 and Safari 8.
     */
    SAFARI_7_1: Feature;

    /** An alias for `SAFARI_7_1`. */
    SAFARI_8: Feature;

    /**
     * Features available in Safari 9.
     */
    SAFARI_9: Feature;

    /** An alias for `ANY_WINDOW`. */
    SELF: Feature;

    /**
     * Existence of the global object self whose string representation starts with "\[object ".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.
     */
    SELF_OBJ: Feature;

    /**
     * Existence of the global string status.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser. This feature is not available inside web workers.
     */
    STATUS: Feature;

    /**
     * The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".
     *
     * This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+ and Node.js.
     */
    UNDEFINED: Feature;

    /**
     * Existence of the global function uneval.
     *
     * @reamarks
     *
     * Available in Firefox.
     */
    UNEVAL: Feature;

    /**
     * A string representation of native functions typical for the V8 engine, but also found in Edge.
     *
     * Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Opera, Android Browser and Node.js.
     */
    V8_SRC: Feature;

    /**
     * Existence of the global object self having the string representation "\[object Window\]".
     *
     * @reamarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera and Android Browser 4.4. This feature is not available inside web workers.
     */
    WINDOW: Feature;
}
