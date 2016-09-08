import * as JEKSON from '../jekson';
import * as assert from 'assert';

describe('ProjectedJSON', () => {
  describe('#parse', () => {

    const testcases = [
      { source: '{}', projection: {}, expected: {} },
      { source: '{"a":"b"}', projection: { "a": true }, expected: { a: "b" } },
      { source: '{"a":"b"}', projection: { "a": false }, expected: {} },
      { source: '{"a":"-a-","b":"not expected","c":"_c_"}', projection: { "a": true, "b": false, "c": true }, expected: { a: "-a-", c: "_c_" } },
      { source: '{"a":01,"b":-1,"c":[],"d":false}', projection: { "a": true, "b": false, "c": true, "d": true }, expected: { a: 1, c: [], d: false } }
    ];

    testcases.forEach((testcase) => {

      it(`correctly parses ${testcase.source}`, () => {
        const result = JEKSON.parse(testcase.source, testcase.projection);
        assert.deepStrictEqual(result, testcase.expected);
      });

    });
  });
});