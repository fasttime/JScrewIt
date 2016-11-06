Feature: User interface

  Backgound:
    Given UI ready

  @appearance
  Scenario: Resizable output area
    Given the output text area has a resize grabber
    Then the resize grabber should not be overlayed by another element

  @interaction
  Scenario: Tab navigation
    Given a standard keyboard
    And the output area content is out of sync
    And the input area has the focus
    When the user presses the tab key
    Then the output area should not be synced
