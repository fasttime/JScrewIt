Feature: Button

  @interaction
  Scenario: Unselectability
    Given a button
    Then the button caption should not be selectable

  @appearance
  Scenario: Focused appearance
    Given a focused button
    Then the button should have an azure outline

  @appearance
  Scenario: Hovered appearance
    Given a hovered button
    Then the button should have a pale blue appearance

  @appearance
  Scenario: Active appearance
    Given an active button
    Then the button should have a deep blue appearance

  @appearance
  Scenario: Disabled appearance
    Given a disabled button
    Then the button should be grayed out

  @appearance
  @interaction
  Scenario Outline: Disabling
    Given a focused button
    And the button is <state>
    When the button is programmatically disabled
    Then the button should not have the focus
    And the button should update its appearance according to the new state immediately

    Examples:
      | state   |
      | default |
      | hovered |
      | active  |

  @interaction
  Scenario: Clicking by spacebar key
    Given a focused button
    And a standard keyboard
    When the user releases the spacebar
    Then the button should click

  @interaction
  Scenario: Clicking by enter key
    Given a focused button
    And a standard keyboard
    When the user presses enter
    Then the button should click

  @interaction
  Scenario: No disabled button clicking
    Given a disabled button
    And a mouse
    When the user clicks on the button with the mouse
    Then the button should not click

  @interaction
  Scenario: Sudden active window switch
    Given an active button
    And a standard keyboard
    When the user presses Ctrl + T
    And the user switches back to the UI tab
    Then the button should not be active
