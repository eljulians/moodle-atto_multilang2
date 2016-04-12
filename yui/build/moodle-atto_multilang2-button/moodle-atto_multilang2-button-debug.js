YUI.add('moodle-atto_multilang2-button', function (Y, NAME) {

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
    };

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

            if (this._highlight) {
                this._addDelimiterCss();
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


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
