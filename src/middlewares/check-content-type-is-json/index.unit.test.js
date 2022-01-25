import assert from 'assert';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { spy, stub } from 'sinon';
import checkContentTypeIsJSON from '.';

describe('checkContentTypeIsJSON', function () {
  let req;
  let res;
  let next;

  describe('content-type header for POST and PUT', function () {
    ['PUT', 'POST'].forEach((method) => {
      describe(`request method is ${method}`, function () {
        describe('content-type header is set to "application/json"', function () {
          let clonedRes;

          this.beforeEach(function () {
            req = {
              method,
              headers: { 'content-type': 'application/json' }
            };
            res = {};
            next = spy();

            clonedRes = cloneDeep(res);
            checkContentTypeIsJSON(req, res, next);
          });

          it('should not modify res', function () {
            assert(isEqual(res, clonedRes));
          });

          it('should call next()', function () {
            assert(next.calledOnce);
          });
        });

        describe('Content-Type is not set to "application/json"', function () {
          let resJSONReturnValue;
          let returnedValue;

          this.beforeEach(function () {
            req = {
              method,
              headers: {
                'content-type': 'text/xml'
              }
            };
            resJSONReturnValue = {};

            res = {
              status: spy(),
              json: stub().returns(resJSONReturnValue)
            };

            next = spy();
            returnedValue = checkContentTypeIsJSON(req, res, next);
          });

          describe('should call the res.status', function () {
            it('once', function () {
              assert(res.status.calledOnce);
            });

            it('with the argument 415', function () {
              assert(res.status.calledWithExactly(415));
            });
          });

          describe('should call res.json()', function () {
            it('once', function () {
              assert(res.json.calledOnce);
            });

            it('with the correct error object', function () {
              assert(
                res.json.calledWithExactly({
                  message:
                    'The "Content-Type" header must always be "application/json"'
                })
              );
            });

            it('should return whatever res.json() returns', function () {
              assert.strictEqual(returnedValue, resJSONReturnValue);
            });
          });
        });
      });
    });
  });
});
