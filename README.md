Atto multilanguage plugin
=====================
This plugin will make the creation of multilingual contents on Moodle much more easier with Atto editor.

The plugin is developed to work with [Iñaki Arenaza's multilang2 filter](https://github.com/iarenaza/moodle-filter_multilang2), and the idea is based on [his plugin for TinyMCE editor](https://github.com/iarenaza/moodle-tinymce_moodlelang2).

Installation
------------

 - Copy repository content in *moodleroot*/lib/editor/atto/plugins. The following can be omitted:
   - moodle-javascript_style_checker/
   - tests/ (if you're not going to test it with Behat)
   - .gitmodules
   - build.xml
 - Install it from Moodle. 
 - Go to Site administration/Plugins/Text
   editors/Atto HTML editor/Atto toolbar settings, and add *multilang2*
   to the Toolbar config where you prefer. E.g. `multilang2 = multilang2`
