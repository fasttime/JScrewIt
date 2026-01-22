Feature: User interface

  Background:
    Given UI ready

  @appearance
  Scenario: Resizable output area
    Given the output area has a resize grabber
    Then the resize grabber should not be overlayed by another element

  @appearance
  Scenario: Output area content wrapping
    When the output area content is overlong
    Then the output area content should be broken into multiple lines
    And all lines in the output area but the last one should be equally long

  @interaction
  Scenario: Double-click in output area
    Given a browser that reacts to double-clicks
    And the output area contains any non-empty text
    When the user double-clicks on the output area
    Then the output area should retain its content and scrolling offsets
    And all output area content should be selected

  @interaction
  Scenario: Tab navigation
    Given a standard keyboard
    And the output area is out of sync
    And the input area has the focus
    When the user presses the tab key
    Then the output area should not be synced
