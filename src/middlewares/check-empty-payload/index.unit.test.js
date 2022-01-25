import assert from 'assert';
import { spy, stub } from 'sinon';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';
import checkEmptyPayload from '.';

describe('checkEmptyPayload', () => {
  let req;
  let res;
  let next;
  describe('req.method is not one of POST, PATCH, or PUT', function () {
    let cloneRes;

    this.beforeEach(function () {
      req = { method: 'GET' };
      res = {};
      next = spy();
      cloneRes = cloneDeep(res);
      checkEmptyPayload(req, res, next);
    });

    it('should not modify res', function () {
      assert(isEqual(res, cloneRes));
    });

    it('should call "next() once ', function () {
      assert(next.calledOnce);
    });
  });

  ['POST', 'PUT'].forEach((method) => {
    describe(`When req.method is ${method}`, function () {
      describe('and the content-length is not "0"', function () {
        let clonedRes;

        this.beforeEach(function () {
          req = {
            method,
            headers: {
              'content-length': '1'
            }
          };
          res = {};
          next = spy();
          clonedRes = cloneDeep(res);
          checkEmptyPayload(req, res, next);
        });

        it('should not modify res', function () {
          assert(isEqual(res, clonedRes));
        });

        it('should call next()', function () {
          assert(next.calledOnce);
        });
      });

      describe('and the content-length header is "0"', function () {
        let resJSONReturnValue;
        let returnedValue;

        this.beforeEach(function () {
          req = {
            method,
            headers: { 'content-length': '0' }
          };

          resJSONReturnValue = {};
          res = {
            status: spy(),
            set: spy(),
            json: stub().returns(resJSONReturnValue)
          };
          next = spy();
          returnedValue = checkEmptyPayload(req, res, next);
        });

        describe('should call the res.status', function () {
          it('once', function () {
            assert(res.status.calledOnce);
          });

          it('with the argument 400', function () {
            assert(res.status.calledWithExactly(400));
          });
        });

        describe('should call res.json()', function () {
          it('once', function () {
            assert(res.json.calledOnce);
          });

          it('with the correct error object', function () {
            assert(
              res.json.calledWithExactly({
                message: 'Payload should not be empty'
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
