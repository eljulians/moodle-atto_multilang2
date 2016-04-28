<?php
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
 * Atto Multilingual content plugin version details.
 *
 * @package   atto_multilang2
 * @copyright 2015 onwards Julen Pardo & Mondragon Unibertsitatea
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
defined('MOODLE_INTERNAL') || die();

$plugin->version      = 2016042800;         // The current plugin version (Date: YYYYMMDDXX).
$plugin->release      = 'master - Release v1.5 (Build 2016042800) for Moodle v2.9 and v3.0';
$plugin->requires     = 2015051100;         // Required Moodle version.
$plugin->component    = 'atto_multilang2'; // Full name of the plugin (used for diagnostics).
$plugin->maturity     = MATURITY_STABLE;
$plugin->dependencies = array(
    'filter_multilang2' => ANY_VERSION  // The filter_multilang2 must be present (any version).
);
