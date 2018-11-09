Feature: Engine selection box

  Background:
    Given UI ready

  @appearance
  Scenario: Engine selection fields
    Given compatibility "Custom…" selected
    Then the engine checkboxes should appear on the left of their version caption
    And the engine checkboxes should be vertically centered with respect to their version caption

  @appearance
  Scenario: Restriction toggling fields
    Given compatibility "Custom…" selected
    Then the question mark controls should be vertically aligned with the preceding text
