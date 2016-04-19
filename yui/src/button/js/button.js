// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * @package    atto_multilang2
 * @copyright  2015 onwards Julen Pardo & Mondragon Unibertsitatea
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * @module moodle-atto_multilang2-button
 */

var CLASSES = {
        TAG: 'filter-multilang-tag'
    },

    LANG_WILDCARD = '%lang',
    CONTENT_WILDCARD = '%content',
    ATTR_LANGUAGES = 'languages',
    ATTR_CAPABILITY = 'capability',
    ATTR_HIGHLIGHT = 'highlight',
    ATTR_CSS = 'css',
    DEFAULT_LANGUAGE = '{"en":"English (en)"}',
    DEFAULT_CAPABILITY = true,
    DEFAULT_HIGHLIGHT = true,
    DEFAULT_CSS =  'outline: 1px dotted;' +
                   'padding: 0.1em;' +
                   'margin: 0em 0.1em;' +
                   'background-color: #ffffaa;',
    TEMPLATES = {
        SPANED: '&nbsp;<span class="' + CLASSES.TAG + '">{mlang ' + LANG_WILDCARD + '}</span>' +
            CONTENT_WILDCARD +
            '<span class="' + CLASSES.TAG + '">{mlang}</span>&nbsp;',

        NOT_SPANED: '{mlang ' + LANG_WILDCARD + '}' + CONTENT_WILDCARD + '{mlang}'
    },
    OPENING_SPAN = '<span class="' + CLASSES.TAG + '">',

    ADDED_SUBMITS = false;

/**
 * Atto text editor multilanguage plugin.
 *
 * @namespace M.atto_multilang2
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_multilang2').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    /**
     * If the {mlang} tags have to be highlighted or not. Received as parameter from lib.php.
     *
     * @property _highlight
     * @type boolean
     * @private
     */
    _highlight: true,

    /**
     * If the {mlang} tags have been cleaned on submit, to check if they have to be cleaned,
     * or if the form has to be submitted.
     *
     * @property _tagsCleaned
     * @type boolean
     * @private
     */
    _tagsCleaned: false,

    initializer: function() {
        var hascapability = this.get(ATTR_CAPABILITY),
            toolbarItems = [];

        if (hascapability) {
            toolbarItems = this._initializeToolbarItems();
            this._highlight = this.get(ATTR_HIGHLIGHT);

            this.addToolbarMenu({
                globalItemConfig: {
                    callback: this._addTags
                },
                icon: 'icon',
                iconComponent: 'atto_multilang2',
                items: toolbarItems
            });

            this.get('host').on('atto:selectionchanged', this._checkSelectionChange, this);

            this._addDelimiterCss();

            if (this._highlight) {
                if (!ADDED_SUBMITS) {
                    ADDED_SUBMITS = true;
                    this._decorateTagsOnInit();
                    this._setSubmitListeners();
                }
            }
        }
    },

    /**
     * Adds the CSS rules for the delimiters, received as parameter from lib.php.
     *
     * @method _addDelimiterCss
     * @private
     */
    _addDelimiterCss: function() {
        var css = '.' + CLASSES.TAG + '{' + this.get(ATTR_CSS) + '}',
            style;

        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;

        document.head.appendChild(style);
    },

    /**
     * Initializes the toolbar items, which will be the installed languages,
     * received as parameter.
     *
     * @method _initializeToolbarItems
     * @private
     * @return {Array} installed language strings
     */
    _initializeToolbarItems: function() {
        var toolbarItems = [],
            languages,
            langCode;

        languages = JSON.parse(this.get(ATTR_LANGUAGES));

        for (langCode in languages) {
            if (languages.hasOwnProperty(langCode)) {
                toolbarItems.push({
                    text: languages[langCode],
                    callbackArgs: langCode
                });
            }
        }

        return toolbarItems;
    },

    /**
     * Retrieves the selected text, wraps it with the multilang tags,
     * and replaces the selected text in the editor with with it.
     *
     * If the 'highlight' setting is checked, the {mlang} will be wrapped between
     * the <span> tags with the class for the CSS highlight; if not, they will not
     * be wrapped.
     *
     * If there is no content selected, a "&nbsp;" will be inserted; otherwhise,
     * it's impossible to place the cursor inside the {mlang} tags.
     *
     * @method _addTags
     * @param {EventFacade} e
     * @param {string} langCode the language code
     * @private
     */
    _addTags: function(e, langCode) {
        var selection,
            host = this.get('host'),
            taggedContent,
            content;

        taggedContent = (this._highlight) ? TEMPLATES.SPANED : TEMPLATES.NOT_SPANED;

        selection = this._getSelectionHTML();
        content = (host.getSelection().toString().length === 0) ? '&nbsp;' : selection;

        taggedContent = taggedContent.replace(LANG_WILDCARD, langCode);
        taggedContent = taggedContent.replace(CONTENT_WILDCARD, content);

        host.insertContentAtFocusPoint(taggedContent);

        this.markUpdated();
    },

    /**
     * Retrieves selected text with its HTML.
     * Took from: http://stackoverflow.com/questions/4176923/html-of-selected-text/4177234#4177234
     *
     * @method _getSelectionHTML
     * @private
     * @return {string} selected text's html; empty if nothing selected
     */
    _getSelectionHTML: function() {
        var html = '',
            selection,
            container,
            index,
            lenght;

        if (typeof window.getSelection !== 'undefined') {
            selection = window.getSelection();

            if (selection.rangeCount) {
                container = document.createElement('div');
                for (index = 0, lenght = selection.rangeCount; index < lenght; ++index) {
                    container.appendChild(selection.getRangeAt(index).cloneContents());
                }
                html = container.innerHTML;
            }

        } else if (typeof document.selection !== 'undefined') {
            if (document.selection.type === 'Text') {
                html = document.selection.createRange().htmlText;
            }
        }

        return html;
    },
    /**
     * Listens to every change of the text cursor in the text area. If the
     * cursor is placed within a multilang tag, the whole tag is selected.
     *
     * @method _checkSelectionChange
     * @private
     */
    _checkSelectionChange: function() {
        var host = this.get('host'),
            node = host.getSelectionParentNode(),
            nodeValue = Y.one(node).get('text'),
            isTextNode,
            isLangTag;

        isTextNode = Y.one(node).toString().indexOf('#text') > - 1;
        isLangTag = (nodeValue.match(/\{mlang/g).length === 1);

        if (isTextNode && isLangTag) {
            host.setSelection(host.getSelectionFromNode(Y.one(node)));
        }
    },

    /**
     * Sets the submit listener to the function that finds the spaned {mlang} tags.
     *
     * In some forms, there may be two different submit buttons, so we add the listener
     * to the second, if this exists.
     *
     * These submit listeners are set only if the "highlight" plugin setting is checked.
     *
     * @method _setSubmitListener
     * @private
     */
    _setSubmitListeners: function() {
        var submitbutton = Y.one('#id_submitbutton'),
            submitbutton2 = Y.one('#id_submitbutton2');

        submitbutton.on('click', this._cleanTagsOnSubmit, this);

        if (submitbutton2 !== null) {
            submitbutton2.on('click', this._cleanTagsOnSubmitSecondButton, this);
        }
    },

    /**
     * When submit button clicked, this function is invoked. It has to stop the submission,
     * in order to process the textarea to clean the tags.
     * Once the textarea is cleaned, detaches this submit listener, i.e., it sets as default,
     * an then simulates the click, to submit the form.
     * The cleanup with "id" attribute and without it is made separately, to avoid an evil
     * regular expression.
     *
     * @method _cleanTagsOnSubmit
     * @param {EventFacade} e
     * @private
     */
    _cleanTagsOnSubmit: function(e) {
        var submitbutton = Y.one('#id_submitbutton');

        if (!this._tagsCleaned) {
            e.preventDefault();

            this._cleanTagsWithNoYuiId();
            this._cleanTagsWithYuiId();

            this._tagsCleaned = true;
        }

        this.detach();

        submitbutton.simulate('click');
    },

    /**
     * The page may have more than one submit buttons, e.g., for saving and displaying, and for
     * saving and returning to course.
     * The easiest way to determine which event is the "triggerer", is to assign a different listener
     * to each one, and this is the one for the second button that the page could have.
     *
     * @method _cleanTagsOnSubmitSecondButton
     * @param {EventFacade} e
     * @private
     */
    _cleanTagsOnSubmitSecondButton: function(e) {
        var submitbutton = Y.one('#id_submitbutton2');

        if (!this._tagsCleaned) {
            e.preventDefault();

            this._cleanTagsWithNoYuiId();
            this._cleanTagsWithYuiId();

            this._tagsCleaned = true;
        }

        this.detach();

        submitbutton.simulate('click');
    },

    /**
     * Cleans the <span> tags around the {mlang} tags when the form is submitted,
     * that do not have "id" attribute.
     * The cleanup with "id" attribute and without it is made separately, to avoid an evil
     * regular expression.
     *
     * There may be more than one atto editor textarea in the page. So, we have to retrieve
     * the textareas by the class name. If there is only one, the object will be only the
     * reference, but, if there are more, we will have an array. So, the easiest way is to
     * check if what we have is an array, and if it not, create it manually, and iterate it
     * later.
     *
     * @method _cleanTagsWithNoYuiId
     * @private
     */
    _cleanTagsWithNoYuiId: function() {
        var textareas = Y.all('.editor_atto_content'),
            textarea,
            textareaIndex,
            innerHTML,
            spanedmlangtags,
            spanedmlangtag,
            index,
            cleanmlangtag,
            regularExpression;

        regularExpression = new RegExp(OPENING_SPAN + '.*?' + '</span>', 'g');

        if (!textareas instanceof Array) {
            textarea = textareas;
            textareas = [];
            textareas[0] = textarea;
        }

        for (textareaIndex = 0; textareaIndex < textareas._nodes.length; textareaIndex++) {
            textarea = textareas._nodes[textareaIndex].id;
            textarea = Y.one('#' + textarea);

            innerHTML = textarea.get('innerHTML');

            spanedmlangtags = innerHTML.match(regularExpression);

            if (spanedmlangtags === null) {
                continue;
            }
            
            for (index = 0; index < spanedmlangtags.length; index++) {
                spanedmlangtag = spanedmlangtags[index];
                cleanmlangtag = spanedmlangtag.replace(OPENING_SPAN, '');

                cleanmlangtag = cleanmlangtag.replace('</span>', '');

                innerHTML = innerHTML.replace(spanedmlangtag, cleanmlangtag);
            }

            textarea.set('innerHTML', innerHTML);
        }

        this.markUpdated();
    },

    /**
     * Cleans the <span> tags around the {mlang} tags when the form is submitted,
     * that have "id" attribute, generated by YUI, when the cursor is placed on the tags.
     * The cleanup with "id" attribute and without it is made separately, to avoid an evil
     * regular expression.
     *
     * There may be more than one atto editor textarea in the page. So, we have to retrieve
     * the textareas by the class name. If there is only one, the object will be only the
     * reference, but, if there are more, we will have an array. So, the easiest way is to
     * check if what we have is an array, and if it not, create it manually, and iterate it
     * later.
     *
     * @method anTagsWithYuiId
     * @private
     */
     _cleanTagsWithYuiId: function() {
        var textareas = Y.all('.editor_atto_content'),
            textarea,
            textareaIndex,
            innerHTML,
            spanedmlangtag,
            index,
            cleanmlangtag,
            regularExpression,
            openingspanwithyui,
            spanedmlangtagsdwithyui,
            mlangtag;

        openingspanwithyui = OPENING_SPAN.replace('<span', '<span id="yui_.*?"');
        regularExpression = new RegExp(openingspanwithyui + '.*?{mlang.*?}</span>', 'g');

        if (!textareas instanceof Array) {
            textarea = textareas;
            textareas = [];
            textareas[0] = textarea;
        }
        
        for (textareaIndex = 0; textareaIndex < textareas._nodes.length; textareaIndex++) {
            textarea = textareas._nodes[textareaIndex].id;
            textarea = Y.one('#' + textarea);

            innerHTML = textarea.get('innerHTML');

            spanedmlangtagsdwithyui = innerHTML.match(regularExpression);

            if (spanedmlangtagsdwithyui === null) {
                continue;
            }
            
            for (index = 0; index < spanedmlangtagsdwithyui.length; index++) {
                spanedmlangtag = spanedmlangtagsdwithyui[index];
                mlangtag = spanedmlangtag.match(/\{mlang.*?\}/g)[0];

                cleanmlangtag = spanedmlangtag.replace(regularExpression, mlangtag);
                cleanmlangtag = cleanmlangtag.replace('</span>', '');

                innerHTML = innerHTML.replace(spanedmlangtag, cleanmlangtag);
            }

            textarea.set('innerHTML', innerHTML);

            this.markUpdated();
        }
    },

    /**
     * Adds the <span> tags to the {mlang} tags when the editor is loaded.
     * In this case, we DON'T HAVE TO CALL TO markUpdated(). Why? Honestly,
     * I don't know. But, if we call it after setting the HTML, the {mlang}
     * tags flicker with the decoration, and returns to their original state.
     *
     * Instead of taking the HTML directly from the textarea, we have to
     * retrieve it, first, without the <span> tags that can be stored
     * in database, due to a bug in version 2015120501 that stores the
     * {mlang} tags in database, with the <span> tags.
     * More info about this bug: https://github.com/julenpardo/moodle-atto_multilang2/issues/8
     *
     * Every different {mlang} tag has to be replaced only once, otherwise,
     * nested <span>s will be created in every repeated replacement. So, we
     * have to have a track of which replacements have been made.
     *
     * @method _decorateTagsOnInit
     * @private
     */
    _decorateTagsOnInit: function() {
        var textarea = Y.all('.editor_atto_content'),
            innerHTML,
            regularExpression,
            mlangtags,
            mlangtag,
            index,
            decoratedmlangtag,
            replacementsmade = [],
            notreplacedyet;

        innerHTML = this._getHTMLwithCleanedTags();

        regularExpression = new RegExp('{mlang.*?}', 'g');
        mlangtags = innerHTML.match(regularExpression);

        if (mlangtags !== null) {
            for (index = 0; index < mlangtags.length; index++) {
                mlangtag = mlangtags[index];

                notreplacedyet = replacementsmade.indexOf(mlangtag) === -1;

                if (notreplacedyet) {
                    replacementsmade.push(mlangtag);

                    decoratedmlangtag = OPENING_SPAN + mlangtag + '</span>';
                    regularExpression = new RegExp(mlangtag, 'g');

                    innerHTML = innerHTML.replace(regularExpression, decoratedmlangtag);
                }
            }

            textarea.set('innerHTML', innerHTML);
        }

    },

    /**
     * This function returns the HTML as it is in the textarea, but cleaning every
     * <span> tag around the {mlang} tags. This is necessary for decorating tags on
     * init, because it could happen that in database are stored the {mlang} tags with
     * their <span> tags, due to a bug in version 2015120501.
     * More info about this bug: https://github.com/julenpardo/moodle-atto_multilang2/issues/8
     *
     * @method _getHTMLwithCleanedTags
     * @return {string} HTML in textarea, without any <span> around {mlang} tags
     */
    _getHTMLwithCleanedTags: function() {
        var host = this.get('host'),
            innerHTML = host.getCleanHTML(),
            regexString,
            regularExpression,
            spanedmlangtags,
            spanedmlangtag,
            cleanmlangtag,
            index;

        regexString = OPENING_SPAN + '.*?' + '</span>';
        regularExpression = new RegExp(regexString, 'g');
        spanedmlangtags = innerHTML.match(regularExpression);

        if (spanedmlangtags !== null) {
            for (index = 0; index < spanedmlangtags.length; index++) {
                spanedmlangtag = spanedmlangtags[index];

                cleanmlangtag = spanedmlangtag.replace(OPENING_SPAN, '');
                cleanmlangtag = cleanmlangtag.replace('</span>', '');

                innerHTML = innerHTML.replace(spanedmlangtag, cleanmlangtag);
            }
        }

        return innerHTML;
    }

}, {
    ATTRS: {
        /**
         * The list of installed languages.
         *
         * @attribute languages
         * @type array
         * @default {"en":"English (en)"}
         */
        languages: DEFAULT_LANGUAGE,

        /**
         * If the current user has the capability to use the plugin.
         *
         * @attribute capability
         * @type boolean
         * @default true
         */
        capability: DEFAULT_CAPABILITY,

        /**
         * If the {mlang} tags have to be highlighted or not.
         *
         * @property highlight
         * @type boolean
         * @default true
         */
        highlight: DEFAULT_HIGHLIGHT,

        /**
         * The CSS for delimiters.
         *
         * @property css
         * @type string
         * @default DEFAULT_CSS
         */
        css: DEFAULT_CSS
    }
});
