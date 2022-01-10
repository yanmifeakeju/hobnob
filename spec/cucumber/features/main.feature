Feature: General

  Scenario Outline: POST and PUT request non-empty payload

    All POST and PUT request muust have non-zero values for its "Content-Length" header


    When the client creates a <method> request to /users
    And attaches a generic empty payload
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says "Payload should not be empty"

    Examples:
      | method |
      | POST   |
