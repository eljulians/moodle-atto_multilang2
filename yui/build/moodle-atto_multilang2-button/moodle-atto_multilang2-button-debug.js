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
        BEGIN: 'multilang_tag multilang_begin',
        END: 'multilang_tag multilang_end',
        CONTENT: 'multilang_content'
    },

    STYLE = 'outline: 1px dotted;' +
            'padding: 0.1em;' +
            'margin: 0em 0.1em;' +
            'background-color: #ffffaa;',

    LANG_WILDCARD = '%lang',
    CONTENT_WILDCARD = '%content',
    ATTR_LANGUAGES = 'languages',
    DEFAULT_LANGUAGE = '{"en":"English (en)"}',
    START_TAG = '{mlang ' + LANG_WILDCARD + '}',
    END_TAG = '{mlang}',

    TEMPLATE = '' +
        '&nbsp;<span class="' + CLASSES.BEGIN + '" style="' + STYLE + '">{mlang ' + LANG_WILDCARD + '}</span>' +
        '<span class="' + CLASSES.CONTENT + '">' + CONTENT_WILDCARD + '</span>' +
        '<span class="' + CLASSES.END + '" style="' + STYLE + '">{mlang}</span>&nbsp;';

/**
 * Atto text editor multilanguage plugin.
 *
 * @namespace M.atto_multilang2
 * @class button
 * @extends M.editor_atto.EditorPlugin
 */

Y.namespace('M.atto_multilang2').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

    _languages: null,

    initializer: function() {
        var toolbarItems = [],
            langCode;

        this._languages = JSON.parse(this.get(ATTR_LANGUAGES));

        for (langCode in this._languages) {
            toolbarItems.push({
                text: this._languages[langCode],
                callbackArgs: langCode
            });
        }

        this.addToolbarMenu({
            globalItemConfig: {
                callback: this._addTags
            },
            items: toolbarItems
        });

        this.get('host').on('atto:selectionchanged', this._checkSelectionChange, this);
    },

    _addTags: function(e, langCode) {
        var host = this.get('host'),
            content = TEMPLATE;

        content = content.replace(LANG_WILDCARD, langCode);
        content = content.replace(CONTENT_WILDCARD, host.getSelection());

        host.insertContentAtFocusPoint(content);

        this.markUpdated();
    },

    _checkSelectionChange: function() {
        var host = this.get('host'),
    	    node = host.getSelectionParentNode(),
            langCode,
            nodeValue,
            startTag,
            endTag;

        nodeValue = Y.one(node).get('text');

        for (langCode in this._languages) {
            startTag = START_TAG.replace(LANG_WILDCARD, langCode);
            endTag = END_TAG.replace(LANG_WILDCARD, langCode);
        	
            if (nodeValue === startTag || nodeValue === endTag) {
                host.setSelection(host.getSelectionFromNode(Y.one(node)));
            }
        }
    }

}, {
    ATTRS: {
        languages: DEFAULT_LANGUAGE
    }
});

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
