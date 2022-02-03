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

  Scenario: Content-Type header should be set for requests with non-empty payloads
    All requests which has non-zero values for its "Content-Type" header must have its "Content-Type" header set

    When the client creates a POST request to /users
    And attaches a generic non-JSON payload
    But without a "Content-Type" header set
    And sends the request
    Then our API should respond with a 400 HTTP status code
    And the payload of the response should be a JSON object
    And contains a message property which says 'The "Content-Type" header must be set for request with a non-empty payload'
