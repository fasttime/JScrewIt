Feature: Modal box

  @appearance
  Scenario: General appearance
    Given a modal box
    Then the modal box should have a rounded blue border
    And the modal box should have a whitesmoke background
    And the modal box should contain an "OK" button in the bottom center
    And the "OK" button should be 5em wide

  @appearance
  Scenario: Focus outline
    Given a focused modal box
    Then the modal box should have an azure outline

  @appearance
  Scenario: Horizontal alignment
    Given a modal box
    And the viewport is wider than 500px
    Then the modal box should be centered horizontally
    And the modal box should be 496px wide

  @appearance
  Scenario: Adaptive width
    Given a modal box
    And the viewport is little less than 500px wide
    Then the modal box should have 2px margin from the left and right bounds of the viewport

  @appearance
  Scenario: Vertical alignment
    Given a modal box
    And the viewport is at least 4px higher than the modal box
    Then the modal box should be centered vertically

  @appearance
  Scenario: Overwide content clipping
    Given a modal box
    And the content of the modal box is too wide to show at once
    Then the content should have 1.5em margin from the left and right border of the modal box

  @appearance
  Scenario: Scrolling overlay
    Given a modal box
    And the modal box is too high to show at once
    Then the user should be able to scroll the overlay vertically

  @interaction
  Scenario: Opening
    When a modal box pops up
    Then the modal box should get the focus

  @interaction
  Scenario: Tab navigation
    Given a modal box
    And a standard keyboard
    When the user presses the tab key until the modal box gets the focus back
    Then the focus should never move to an overlayed element

  @interaction
  Scenario: Focus lock
    Given a modal box
    When the user clicks/taps any overlayed element
    Then the focus should never move to an overlayed element

  @interaction
  Scenario: Closing by enter or esc key
    Given a focused modal box
    And a standard keyboard
    When the user presses one of the following keys:
      |  key  |
      | enter |
      | esc   |
    Then the modal box should close

  @interaction
  Scenario: Closing with the "OK" button
    Given a modal box
    When the user clicks/taps the "OK" button
    Then the modal box should close
