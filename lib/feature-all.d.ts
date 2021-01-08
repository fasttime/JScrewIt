import { ElementaryFeature, PredefinedFeature } from './feature';

export interface FeatureAll
{
    /** Features available in Android Browser 4.0. */
    ANDRO_4_0: PredefinedFeature;

    /** Features available in Android Browser 4.1 to 4.3. */
    ANDRO_4_1: PredefinedFeature;

    /** Features available in Android Browser 4.4. */
    ANDRO_4_4: PredefinedFeature;

    /**
     * Existence of the global object document whose string representation starts with "\[object " and ends with "Document\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.
     */
    ANY_DOCUMENT: ElementaryFeature;

    /**
     * Existence of the global object self whose string representation starts with "\[object " and ends with "Window\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.
     */
    ANY_WINDOW: ElementaryFeature;

    /**
     * The property that the string representation of Array.prototype.entries\(\) starts with "\[object Array" and ends with "\]" at index 21 or 22.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 0.12+.
     */
    ARRAY_ITERATOR: ElementaryFeature;

    /**
     * Support for arrow functions.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 10+, Opera, and Node.js 4+.
     */
    ARROW: ElementaryFeature;

    /**
     * Existence of the global functions atob and btoa.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari before 10.
     */
    ATOB: ElementaryFeature;

    /** All features available in the current engine. */
    AUTO: PredefinedFeature;

    /**
     * Existence of the global object statusbar having the string representation "\[object BarProp\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.
     */
    BARPROP: ElementaryFeature;

    /**
     * Features available in all browsers.
     *
     * No support for Node.js.
     */
    BROWSER: PredefinedFeature;

    /**
     * The property that the various string methods returning HTML code such as String.prototype.big or String.prototype.link have both the tag name and attributes written in capital letters.
     *
     * @remarks
     *
     * Available in Internet Explorer.
     */
    CAPITAL_HTML: ElementaryFeature;

    /**
     * Features available in the current stable versions of Chrome, Edge and Opera.
     *
     * An alias for `CHROME_86`.
     */
    CHROME: PredefinedFeature;

    /**
     * Features available in Chrome 86, Edge 86 and Opera 72 or later.
     *
     * @remarks
     *
     * This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `CHROME` or `CHROME_PREV` instead of `CHROME_86` for long term support.
     *
     * @see
     *
     * [Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)
     */
    CHROME_86: PredefinedFeature;

    /**
     * Features available in the previous to current versions of Chrome and Edge.
     *
     * An alias for `CHROME_86`.
     */
    CHROME_PREV: PredefinedFeature;

    /**
     * All new browsers' features.
     *
     * No support for Node.js and older browsers like Internet Explorer, Safari 9 or Android Browser.
     */
    COMPACT: PredefinedFeature;

    /**
     * Existence of the global object console having the string representation "\[object Console\]".
     *
     * This feature may become unavailable when certain browser extensions are active.
     *
     * @remarks
     *
     * Available in Internet Explorer 10+, Safari, and Android Browser. This feature is not available inside web workers in Safari before 7.1 and Android Browser 4.4.
     */
    CONSOLE: ElementaryFeature;

    /** Minimum feature level, compatible with all supported engines in all environments. */
    DEFAULT: PredefinedFeature;

    /**
     * Existence of the global object document having the string representation "\[object Document\]".
     *
     * @remarks
     *
     * Available in Internet Explorer before 11. This feature is not available inside web workers.
     */
    DOCUMENT: ElementaryFeature;

    /**
     * Existence of the global object self having the string representation "\[object DOMWindow\]".
     *
     * @remarks
     *
     * Available in Android Browser before 4.4. This feature is not available inside web workers.
     */
    DOMWINDOW: ElementaryFeature;

    /**
     * The property that double quotation mark, less than and greater than characters in the argument of String.prototype.fontcolor are escaped into their respective HTML entities.
     *
     * @remarks
     *
     * Available in Android Browser and Node.js before 0.12.
     */
    ESC_HTML_ALL: ElementaryFeature;

    /**
     * The property that double quotation marks in the argument of String.prototype.fontcolor are escaped as "\&quot;".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.
     */
    ESC_HTML_QUOT: ElementaryFeature;

    /**
     * The property that only double quotation marks and no other characters in the argument of String.prototype.fontcolor are escaped into HTML entities.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js 0.12+.
     */
    ESC_HTML_QUOT_ONLY: ElementaryFeature;

    /**
     * Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format line feed characters \("\\n"\) in their string representation.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 12+.
     */
    ESC_REGEXP_LF: ElementaryFeature;

    /**
     * Having regular expressions created with the RegExp constructor use escape sequences starting with a backslash to format slashes \("/"\) in their string representation.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Node.js 4+.
     */
    ESC_REGEXP_SLASH: ElementaryFeature;

    /**
     * Existence of the global object sidebar having the string representation "\[object External\]".
     *
     * @remarks
     *
     * Available in Firefox. This feature is not available inside web workers.
     */
    EXTERNAL: ElementaryFeature;

    /**
     * Features available in the current stable version of Firefox.
     *
     * An alias for `FF_83`.
     */
    FF: PredefinedFeature;

    /**
     * Features available in Firefox 78 to 82.
     *
     * @remarks
     *
     * This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF_ESR` or `FF_PREV` instead of `FF_78` for long term support.
     *
     * @see
     *
     * [Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)
     */
    FF_78: PredefinedFeature;

    /**
     * Features available in Firefox 83 or later.
     *
     * @remarks
     *
     * This feature may be replaced or removed in the near future when current browser versions become obsolete. Use `FF` instead of `FF_83` for long term support.
     *
     * @see
     *
     * [Engine Support Policy](https://github.com/fasttime/JScrewIt#engine-support-policy)
     */
    FF_83: PredefinedFeature;

    /**
     * Features available in the current version of Firefox ESR.
     *
     * An alias for `FF_78`.
     */
    FF_ESR: PredefinedFeature;

    /**
     * Features available in the previous to current version of Firefox.
     *
     * An alias for `FF_78`.
     */
    FF_PREV: PredefinedFeature;

    /**
     * A string representation of native functions typical for Firefox and Safari.
     *
     * Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
     *
     * @remarks
     *
     * Available in Firefox and Safari.
     */
    FF_SRC: ElementaryFeature;

    /**
     * Existence of the native function Array.prototype.fill.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 7.1+, Opera, and Node.js 4+.
     */
    FILL: ElementaryFeature;

    /**
     * Existence of the native function Array.prototype.flat.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 12+, Opera, and Node.js 11+.
     */
    FLAT: ElementaryFeature;

    /**
     * Existence of the function String.fromCodePoint.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 4+.
     */
    FROM_CODE_POINT: ElementaryFeature;

    /**
     * A string representation of dynamically generated functions where the character at index 19 is a line feed \("\\n"\).
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Opera, and Node.js 10+.
     */
    FUNCTION_19_LF: ElementaryFeature;

    /**
     * A string representation of dynamically generated functions where the character at index 22 is a line feed \("\\n"\).
     *
     * @remarks
     *
     * Available in Internet Explorer, Safari 9+, Android Browser, and Node.js before 10.
     */
    FUNCTION_22_LF: ElementaryFeature;

    /**
     * Having the global function toString return the string "\[object Undefined\]" when invoked without a binding.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, and Node.js.
     */
    GLOBAL_UNDEFINED: ElementaryFeature;

    /**
     * Presence of the text "GMT" after the first 25 characters in the string returned by Date\(\).
     *
     * The string representation of dates is implementation dependent, but most engines use a similar format, making this feature available in all supported engines except Internet Explorer 9 and 10.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, Android Browser, and Node.js.
     */
    GMT: ElementaryFeature;

    /**
     * Existence of the global object history having the string representation "\[object History\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.
     */
    HISTORY: ElementaryFeature;

    /**
     * Existence of the global object Audio whose string representation starts with "function HTMLAudioElement".
     *
     * @remarks
     *
     * Available in Android Browser 4.4. This feature is not available inside web workers.
     */
    HTMLAUDIOELEMENT: ElementaryFeature;

    /**
     * Existence of the global object document having the string representation "\[object HTMLDocument\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari, Opera, and Android Browser. This feature is not available inside web workers.
     */
    HTMLDOCUMENT: ElementaryFeature;

    /** Features available in Internet Explorer 10. */
    IE_10: PredefinedFeature;

    /** Features available in Internet Explorer 11. */
    IE_11: PredefinedFeature;

    /** Features available in Internet Explorer 11 on Windows 10. */
    IE_11_WIN_10: PredefinedFeature;

    /** Features available in Internet Explorer 9. */
    IE_9: PredefinedFeature;

    /**
     * A string representation of native functions typical for Internet Explorer.
     *
     * Remarkable traits are the presence of a line feed character \("\\n"\) at the beginning and at the end of the string and a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
     *
     * @remarks
     *
     * Available in Internet Explorer.
     */
    IE_SRC: ElementaryFeature;

    /**
     * The ability to use unary increment operators with string characters, like in \( ++"some string"\[0\] \): this will result in a TypeError in strict mode in ECMAScript compliant engines.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser, and Node.js. This feature is not available when strict mode is enforced in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, and Node.js 5+.
     */
    INCR_CHAR: ElementaryFeature;

    /**
     * Existence of the global object Intl.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.
     */
    INTL: ElementaryFeature;

    /**
     * Language sensitive string representation of Infinity as "∞".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 0.12+.
     */
    LOCALE_INFINITY: ElementaryFeature;

    /**
     * Features shared by all engines capable of localized number formatting, including output of Arabic digits, the Arabic decimal separator "٫", the letters in the first word of the Arabic string representation of NaN \("ليس"\), Persian digits and the Persian digit group separator "٬".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.
     */
    LOCALE_NUMERALS: ElementaryFeature;

    /**
     * Extended localized number formatting.
     *
     * This includes all features of LOCALE_NUMERALS plus the output of the first three letters in the second word of the Arabic string representation of NaN \("رقم"\), Bengali digits and the letters in the Russian string representation of NaN \("не число"\).
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 11 on Windows 10, Safari 10+, Opera, Android Browser 4.4, and Node.js 13+.
     */
    LOCALE_NUMERALS_EXT: ElementaryFeature;

    /**
     * Existence of the name property for functions.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.
     */
    NAME: ElementaryFeature;

    /**
     * Existence of the global object Node having the string representation "\[object NodeConstructor\]".
     *
     * @remarks
     *
     * Available in Safari before 10. This feature is not available inside web workers.
     */
    NODECONSTRUCTOR: ElementaryFeature;

    /** Features available in Node.js 0.10. */
    NODE_0_10: PredefinedFeature;

    /** Features available in Node.js 0.12. */
    NODE_0_12: PredefinedFeature;

    /** Features available in Node.js 10. */
    NODE_10: PredefinedFeature;

    /** Features available in Node.js 11. */
    NODE_11: PredefinedFeature;

    /** Features available in Node.js 12. */
    NODE_12: PredefinedFeature;

    /** Features available in Node.js 13 and Node.js 14. */
    NODE_13: PredefinedFeature;

    /** Features available in Node.js 15 or later. */
    NODE_15: PredefinedFeature;

    /** Features available in Node.js 4. */
    NODE_4: PredefinedFeature;

    /** Features available in Node.js 5 to 9. */
    NODE_5: PredefinedFeature;

    /**
     * A string representation of native functions typical for V8 or for Internet Explorer but not for Firefox and Safari.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Internet Explorer, Opera, Android Browser, and Node.js.
     */
    NO_FF_SRC: ElementaryFeature;

    /**
     * A string representation of native functions typical for most engines with the notable exception of Internet Explorer.
     *
     * A remarkable trait of this feature is the lack of line feed characters at the beginning and at the end of the string.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari, Opera, Android Browser, and Node.js.
     */
    NO_IE_SRC: ElementaryFeature;

    /**
     * The property that the string representation of Array.prototype.entries\(\) evaluates to "\[object Array Iterator\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 9+, Opera, and Node.js 0.12+.
     */
    NO_OLD_SAFARI_ARRAY_ITERATOR: ElementaryFeature;

    /**
     * A string representation of native functions typical for Firefox, Internet Explorer and Safari.
     *
     * A most remarkable trait of this feature is the presence of a line feed followed by four whitespaces \("\\n    "\) before the "\[native code\]" sequence.
     *
     * @remarks
     *
     * Available in Firefox, Internet Explorer, and Safari.
     */
    NO_V8_SRC: ElementaryFeature;

    /**
     * Having the function Object.prototype.toString return the string "\[object Undefined\]" when invoked without a binding.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer 10+, Safari, Opera, Android Browser 4.1+, and Node.js.
     */
    OBJECT_UNDEFINED: ElementaryFeature;

    /**
     * Existence of the global object Intl having the string representation "\[object Object\]"
     *
     * @remarks
     *
     * Available in Firefox before 83, Internet Explorer 11, Safari 10+ before 14.0.1, Android Browser 4.4, and Node.js 0.12+ before 15.
     */
    PLAIN_INTL: ElementaryFeature;

    /**
     * The property that the string representation of String.prototype.matchAll\(\) evaluates to "\[object RegExp String Iterator\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Safari 13+, Opera, and Node.js 12+.
     */
    REGEXP_STRING_ITERATOR: ElementaryFeature;

    /**
     * Features available in the current stable version of Safari.
     *
     * An alias for `SAFARI_14_0_1`.
     */
    SAFARI: PredefinedFeature;

    /** Features available in Safari 10 and Safari 11. */
    SAFARI_10: PredefinedFeature;

    /** Features available in Safari 12. */
    SAFARI_12: PredefinedFeature;

    /** Features available in Safari 13 and Safari 14.0.0. */
    SAFARI_13: PredefinedFeature;

    /** Features available in Safari 14.0.1 or later. */
    SAFARI_14_0_1: PredefinedFeature;

    /** Features available in Safari 7.0. */
    SAFARI_7_0: PredefinedFeature;

    /** Features available in Safari 7.1 and Safari 8. */
    SAFARI_7_1: PredefinedFeature;

    /** An alias for `SAFARI_7_1`. */
    SAFARI_8: PredefinedFeature;

    /** Features available in Safari 9. */
    SAFARI_9: PredefinedFeature;

    /** An alias for `ANY_WINDOW`. */
    SELF: ElementaryFeature;

    /**
     * Existence of the global object self whose string representation starts with "\[object ".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers in Safari 7.1+ before 10.
     */
    SELF_OBJ: ElementaryFeature;

    /**
     * Support for the two-letter locale name "ar" to format decimal numbers as Arabic numerals.
     *
     * @remarks
     *
     * Available in Firefox, Internet Explorer 11, Safari 10+, Android Browser 4.4, and Node.js 13+.
     */
    SHORT_LOCALES: ElementaryFeature;

    /**
     * Existence of the global string status.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser. This feature is not available inside web workers.
     */
    STATUS: ElementaryFeature;

    /**
     * The property that Object.prototype.toString.call\(\) evaluates to "\[object Undefined\]".
     *
     * This behavior is specified by ECMAScript, and is enforced by all engines except Android Browser versions prior to 4.1.2, where this feature is not available.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, Android Browser 4.1+, and Node.js.
     */
    UNDEFINED: ElementaryFeature;

    /**
     * A string representation of native functions typical for the V8 engine.
     *
     * Remarkable traits are the lack of line feed characters at the beginning and at the end of the string and the presence of a single whitespace before the "\[native code\]" sequence.
     *
     * @remarks
     *
     * Available in Chrome, Edge, Opera, Android Browser, and Node.js.
     */
    V8_SRC: ElementaryFeature;

    /**
     * Existence of the global object self having the string representation "\[object Window\]".
     *
     * @remarks
     *
     * Available in Chrome, Edge, Firefox, Internet Explorer, Safari, Opera, and Android Browser 4.4. This feature is not available inside web workers.
     */
    WINDOW: ElementaryFeature;
}

/** Name of an elementary feature. */
type ElementaryFeatureName =
| 'ANY_DOCUMENT'
| 'ANY_WINDOW'
| 'ARRAY_ITERATOR'
| 'ARROW'
| 'ATOB'
| 'BARPROP'
| 'CAPITAL_HTML'
| 'CONSOLE'
| 'DOCUMENT'
| 'DOMWINDOW'
| 'ESC_HTML_ALL'
| 'ESC_HTML_QUOT'
| 'ESC_HTML_QUOT_ONLY'
| 'ESC_REGEXP_LF'
| 'ESC_REGEXP_SLASH'
| 'EXTERNAL'
| 'FF_SRC'
| 'FILL'
| 'FLAT'
| 'FROM_CODE_POINT'
| 'FUNCTION_19_LF'
| 'FUNCTION_22_LF'
| 'GLOBAL_UNDEFINED'
| 'GMT'
| 'HISTORY'
| 'HTMLAUDIOELEMENT'
| 'HTMLDOCUMENT'
| 'IE_SRC'
| 'INCR_CHAR'
| 'INTL'
| 'LOCALE_INFINITY'
| 'LOCALE_NUMERALS'
| 'LOCALE_NUMERALS_EXT'
| 'NAME'
| 'NODECONSTRUCTOR'
| 'NO_FF_SRC'
| 'NO_IE_SRC'
| 'NO_OLD_SAFARI_ARRAY_ITERATOR'
| 'NO_V8_SRC'
| 'OBJECT_UNDEFINED'
| 'PLAIN_INTL'
| 'REGEXP_STRING_ITERATOR'
| 'SELF_OBJ'
| 'SHORT_LOCALES'
| 'STATUS'
| 'UNDEFINED'
| 'V8_SRC'
| 'WINDOW'
;

/** Name of a predefined feature. */
type PredefinedFeatureName =
ElementaryFeatureName
| 'ANDRO_4_0'
| 'ANDRO_4_1'
| 'ANDRO_4_4'
| 'AUTO'
| 'BROWSER'
| 'CHROME_86'
| 'COMPACT'
| 'DEFAULT'
| 'FF_78'
| 'FF_83'
| 'IE_10'
| 'IE_11'
| 'IE_11_WIN_10'
| 'IE_9'
| 'NODE_0_10'
| 'NODE_0_12'
| 'NODE_10'
| 'NODE_11'
| 'NODE_12'
| 'NODE_13'
| 'NODE_15'
| 'NODE_4'
| 'NODE_5'
| 'SAFARI_10'
| 'SAFARI_12'
| 'SAFARI_13'
| 'SAFARI_14_0_1'
| 'SAFARI_7_0'
| 'SAFARI_7_1'
| 'SAFARI_9'
;
