@editor @editor_atto @atto @atto_multilang2
Feature: Atto multilanguage list
  To write multilingual text in Atto, I need to use multi-language content button.

  @javascript
  Scenario: Add the button to the configuration of Atto
    Given I log in as "admin"
    And the following config values are set as admin:
      | toolbar | multilang2 = multilang2, table | editor_atto | # Needed table button, otherwise multilang list doesn't spread out...
    And I am on homepage
    And I follow "Profile" in the user menu
    And I follow "Edit profile"
    And I set the field "Description" to "Multilingual content"
    And I select the text in the "Description" Atto editor
    When I click on "Multi-Language Content (v2)" "button"
    When I click on "English (en)" "link"
    Then I should see "{mlang en}Multilingual content{mlang}"

  @javascript
  Scenario: Tag some text with multilang labels again, now checking their style
    Given I log in as "admin"
    And the following config values are set as admin:
      | toolbar | multilang2 = multilang2, table | editor_atto | # Needed table button, otherwise multilang list doesn't spread out...
    And I am on homepage
    And I follow "Profile" in the user menu
    And I follow "Edit profile"
    And I set the field "Description" to "Multilingual content, again"
    And I select the text in the "Description" Atto editor
    When I click on "Multi-Language Content (v2)" "button"
    When I click on "English (en)" "link"
    And I press "Update profile"
    And I follow "Preferences" in the user menu
    And I follow "Editor preferences"
    And I set the field "Text editor" to "Plain text area"
    And I press "Save changes"
    And I follow "Edit profile"
    Then I should see "<span class=\"multilang_tag multilang_begin\" style=\"padding:.1em;margin:0em .1em;background-color:#ffffaa;\">{mlang en}</span><span class=\"multilang_content\">Multilingual content, again</span><span class=\"multilang_tag multilang_end\" style=\"padding:.1em;margin:0em .1em;background-color:#ffffaa;\">{mlang}</span>"