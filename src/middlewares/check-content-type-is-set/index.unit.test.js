import assert from 'assert';
import { spy, stub } from 'sinon';
import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import checkContentTypeIsSet from '.';

describe('checkContenTypeIsSet', function () {
  let req;
  let res;
  let next;

  describe('Content-Length is greater than "0"', function () {
    describe('Content-Type is set', function () {
      let clonedRes;
      this.beforeEach(function () {
        req = {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'content-length': '1' }
        };
        res = {};
        clonedRes = cloneDeep(res);
        next = spy();

        checkContentTypeIsSet(req, res, next);
      });

      it('should not modify res', function () {
        assert(isEqual(clonedRes, res));
      });
      it('should called next() once', function () {
        assert(next.calledOnce);
      });
    });

    describe('Content-Type is not set', function () {
      let resJSONReturnValue;
      let returnedValue;

      this.beforeEach(function () {
        req = {
          method: 'POST',
          headers: { 'content-length': '1' }
        };
        resJSONReturnValue = {};
        res = {
          status: spy(),
          json: stub().returns(resJSONReturnValue)
        };

        next = spy();

        returnedValue = checkContentTypeIsSet(req, res, next);
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
              message:
                'The "Content-Type" header must be set for request with a non-empty payload'
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
