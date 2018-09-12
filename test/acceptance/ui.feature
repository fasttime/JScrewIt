Feature: User interface

  Backgound:
    Given UI ready

  @appearance
  Scenario: Resizable output area
    Given the output text area has a resize grabber
    Then the resize grabber should not be overlayed by another element

  @appearance
  Scenario: Output area content wrapping
    Given the output area content is overlong
    Then the output area content should break into multiple lines

  @interaction
  Scenario: Tab navigation
    Given a standard keyboard
    And the output area is out of sync
    And the input area has the focus
    When the user presses the tab key
    Then the output area should not be synced
