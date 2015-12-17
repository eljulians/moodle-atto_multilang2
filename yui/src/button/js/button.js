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

var CSS = {
        BEGIN: 'multilang_begin',
        END: 'multilang_end'
    },

    SELECTORS = {
        BEGIN: '.multilang_begin',
        END: '.multilang_end'
    },

    STYLE = '' + SELECTORS.BEGIN + ', ' + SELECTORS.END + '{' +
        'outline: 1px dotted;' +
        'padding: 0.1em;' +
        'margin: 0em 0.1em;' +
        'background-color: #ffffaa;' +
    '}',

    LANG_WILDCARD = '%lang',
    CONTENT_WILDCARD = '%content',

    TEMPLATE = '' +
        '<span class="{{CSS.BEGIN}}">{mlang {{LANG_WILDCARD}}}</span>' +
        '<span>{{CONTENT_WILDCARD}}</span>' +
        '<span class="{{CSS.END}}">{mlang}</span>',

    ATTR_LANGUAGES = 'languages',
    DEFAULT_LANGUAGE = '{"en":"English (en)"}',
    START_TAG = '{mlang ' + LANG_WILDCARD + '}',
    END_TAG = '{mlang}';

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
        var languages = JSON.parse(this.get(ATTR_LANGUAGES));
        var langCode;

        for (langCode in languages) {
            toolbarItems.push({
                text: languages[langCode],
                callbackArgs: START_TAG.replace(LANG_WILDCARD, langCode)
            });
        }

        this.addToolbarMenu({
            globalItemConfig: {
                callback: this._addTags
            },
            items: toolbarItems
        });
    },

    _addTags: function(e, startTag) {
        var host = this.get('host');

        host.insertContentAtFocusPoint(startTag + host.getSelection() + END_TAG);

        this.markUpdated();
    }
}, {
    ATTRS: {
        languages: DEFAULT_LANGUAGE
    }
});
