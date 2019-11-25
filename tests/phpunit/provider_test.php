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
 * Tests for atto_multilang2.
 *
 * Based on unit tests from filter_text, by Damyon Wise.
 *
 * @package    atto_multilang2
 * @category   test
 * @copyright  2019 Kepa Urzelai & Mondragon Unibertsitatea
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

defined('MOODLE_INTERNAL') || die();

use core_privacy\tests\provider_testcase;
use atto_multilang2\privacy\provider;

/**
 * Unit tests for Multi-Language v2 filter.
 *
 * Test that the filter produces the right content depending
 * on the current browsing language.
 *
 * @package    atto_multilang2
 * @category   test
 * @copyright  2019 Kepa Urzelai & Mondragon Unibertsitatea
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class atto_multilang2_provider_testcase extends provider_testcase {
    /** @var object The atto plugin provider to perform the tests on */
    protected $provider;

    /**
     * Setup the test framework
     *
     * @return void
     */
    protected function setUp() {
        parent::setUp();
        $this->resetAfterTest(true);
        $this->provider = new provider();
    }

    /**
     * Perform the actual tests, once the unit test is set up.
     *
     * @return void
     */
    public function test_provider() {
        global $CFG;
        $test = array (
            'sitelang' => 'en',
            'privacymetadata' => 'The Multi-Language Content (v2) plugin for the atto editor does not store any personal data',
        );

        $curlang = $CFG->lang;

        $CFG->lang = $test['sitelang'];
        $this->assertEquals($test['privacymetadata'], $this->provider->get_reason());

        $CFG->lang = $curlang;
    }
}
