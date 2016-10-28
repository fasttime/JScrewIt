Feature: Evaluation result

  @appearance
  Scenario: Content centering
    Given an evaluation result modal box
    Then the content should be centered

  @appearance
  Scenario: Result left-justification
    Given an evaluation result modal box
    And the result spans over multiple lines
    Then all lines in the result should be left-justified

  @appearance
  Scenario: Overwide result scrolling
    Given an evaluation result modal box
    And the result is too wide to show at once
    Then the user should be able to scroll the result horizontally

  @interaction
  Scenario: Closing
    Given an evaluation result modal box
    When the user closes the modal box
    Then the "Run this" button should get the focus
