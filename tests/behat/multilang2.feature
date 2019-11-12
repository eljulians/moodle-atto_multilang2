@editor @editor_atto @atto @atto_multilang2
Feature: Atto multilanguage list
  To write multilingual text in Atto, I need to use multi-language content button.

  @javascript
  Scenario: Tag some text with multilang labels
    Given I log in as "admin"
    And I navigate to "Plugins > Text editors > Atto HTML editor > Atto toolbar settings" in site administration
    And I set the field "Toolbar config" to multiline:
    """
      style1 = title, bold, italic
      list = unorderedlist, orderedlist
      links = link
      files = image, media, managefiles
      style2 = underline, strike, subscript, superscript
      align = align
      indent = indent
      insert = equation, charmap, table, clear
      undo = undo
      accessibility = accessibilitychecker, accessibilityhelper
      other = html, multilang2
    """
    And I click on "Save changes" "button"
    And I open my profile in edit mode
    And I set the field "Description" to "Multilingual content"
    And I select the text in the "Description" Atto editor
    When I click on "Multi-Language Content (v2)" "button"
    When I click on "English" "link"
    And I press "Update profile"
    And I follow "Preferences" in the user menu
    And I follow "Editor preferences"
    And I set the field "Text editor" to "Plain text area"
    And I press "Save changes"
    And I follow "Edit profile"
    Then I should see "{mlang en}Multilingual content{mlang}"
    And I should not see "<span class=\"multilang_tag\">{mlang en}</span>"
