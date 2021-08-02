Feature: Custom compatibility selection

  @interaction
  Scenario: Initial area state
    And UI reloaded
    And UI ready
    When compatibility "Custom…" is selected
    Then the custom compatibility selection area should be expanded

  @interaction
  Scenario Outline: Area state toggling
    Given a browser other than Internet Explorer
    And UI ready
    When compatibility "Custom…" is selected
    And the custom compatibility selection area is <start-state>
    And the user clicks on the custom compatibility selection area
    Then the custom compatibility selection area should be <end-state>

    Examples:
      | start-state | end-state |
      | expanded    | collapsed |
      | collapsed   | expanded  |

  @interaction
  Scenario Outline: Area state persistence
    Given a browser other than Internet Explorer
    And UI ready
    When compatibility "Custom…" is selected
    And the custom compatibility selection area is <state>
    And a compatibility other than "Custom…" is selected
    And compatibility "Custom…" is selected
    Then the custom compatibility selection area should be <state>

    Examples:
      | state     |
      | expanded  |
      | collapsed |

  @appearance
  Scenario: Engine selection fields
    Given UI ready
    When compatibility "Custom…" is selected
    And the custom compatibility selection area is expanded
    Then the engine checkboxes should appear on the left of their version caption
    And the engine checkboxes should be vertically centered with respect to their version caption

  @appearance
  Scenario: Restriction toggling fields
    Given UI ready
    When compatibility "Custom…" is selected
    And the custom compatibility selection area is expanded
    Then the question mark controls should be vertically aligned with the preceding text
