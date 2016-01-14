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
        TAG: 'multilang_tag',
        CONTENT: 'multilang_content'
    },

    LANG_WILDCARD = '%lang',
    CONTENT_WILDCARD = '%content',
    ATTR_LANGUAGES = 'languages',
    DEFAULT_LANGUAGE = '{"en":"English (en)"}',

    TEMPLATE = '' +
        '&nbsp;<span class="' + CLASSES.TAG + '">{mlang ' + LANG_WILDCARD + '}</span>' +
        '<span class="' + CLASSES.CONTENT + '">' + CONTENT_WILDCARD + '</span>' +
        '<span class="' + CLASSES.TAG + '">{mlang}</span>&nbsp;';

/**
 * Atto text editor multilanguage plugin.
 *
 * @namespace M.atto_multilang2
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_multilang2').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    initializer: function() {
        var toolbarItems = [];

        toolbarItems = this._initializeToolbarItems();

        this.addToolbarMenu({
            globalItemConfig: {
                callback: this._addTags
            },
            icon: 'icon',
            iconComponent: 'atto_multilang2',
            items: toolbarItems
        });

        this.get('host').on('atto:selectionchanged', this._checkSelectionChange, this);
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
     * @method _addTags
     * @param {EventFacade} e
     * @param {string} langCode the language code
     * @private
     */
    _addTags: function(e, langCode) {
        var host = this.get('host'),
            content = TEMPLATE;

        content = content.replace(LANG_WILDCARD, langCode);
        content = content.replace(CONTENT_WILDCARD, host.getSelection());

        host.insertContentAtFocusPoint(content);

        this.markUpdated();
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
         * The list of installed languages
         *
         * @attribute languages
         * @type array
         * @default {"en":"English (en)"}
         */
        languages: DEFAULT_LANGUAGE
    }
});

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
