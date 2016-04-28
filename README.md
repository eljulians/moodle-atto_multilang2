Atto multilanguage plugin
=========================

![Release](https://img.shields.io/badge/release-v1.5-brightgreen.svg) ![Supported](https://img.shields.io/badge/supported-Moodle%202.9,%20Moodle%203.0-green.svg)

This plugin will make the creation of multilingual contents on Moodle much more easier with Atto editor.

The plugin is developed to work with [Iñaki Arenaza's multilang2 filter](https://github.com/iarenaza/moodle-filter_multilang2), and the idea is based on [his plugin for TinyMCE editor](https://github.com/iarenaza/moodle-tinymce_moodlelang2).

## Current version
The latest release is the v1.5 (build 2016042800) for Moodle 2.9 and 3.0. Checkout [v2.9.1.5](https://github.com/julenpardo/moodle-atto_multilang2/releases/tag/v2.9.1.5) and [v3.0.1.5](https://github.com/julenpardo/moodle-atto_multilang2/releases/tag/v3.0.1.5) releases, respectively.

## Changes from v1.4
 - Fix issue "Quiz cannot be evaluated" (see [issue 15](https://github.com/julenpardo/moodle-atto_multilang2/issues/15)).

## Requirements
As mentioned before, [filter_multilang2](https://github.com/iarenaza/moodle-filter_multilang2) is required.

## Installation

 - Copy repository content in *moodleroot*/lib/editor/atto/plugins. The following can be omitted:
   - moodle-javascript_style_checker/
   - tests/ (if you're not going to test it with Behat)
   - .gitmodules
   - build.xml
 - Install it from Moodle. 
 - Go to Site administration/Plugins/Text
   editors/Atto HTML editor/Atto toolbar settings, and add *multilang2*
   to the Toolbar config where you prefer. E.g. `multilang2 = multilang2`
