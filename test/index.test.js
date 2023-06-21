const { describe, it } = require('node:test');
const assert = require('node:assert');
const flakeId = require('../index.js');

describe('flake id', () => {
  it('export is default constructor', () => {
    assert.strictEqual(flakeId, flakeId.prototype.constructor);
  });
  it('new instance with machien id', () => {
    const flake = new flakeId({ id: 1 });
    assert.strictEqual(flake.genId, '001');
    assert.strictEqual(flake.epoch, 0);
    assert.strictEqual(flake.lastOffset, 0);
    assert.strictEqual(flake.seq, 0);
  });
  it('new instance with region and worker', () => {
    const flake = new flakeId({ region: 1, worker: 2 });
    assert.strictEqual(flake.genId, '102');
  });
  it('machine id is prior to region and worker', () => {
    const flake = new flakeId({ id: 1, region: 1, worker: 2 });
    assert.strictEqual(flake.genId, '001');
  });
  it('id must be less than 1000', () => {
    assert.throws(
      () => {
        new flakeId({ id: Math.floor(Math.random() * 1e4) + 1e3 });
      },
      {
        message: 'id must be less than 1000',
      }
    );
  });
  it('region must be less than 10', () => {
    assert.throws(
      () => {
        new flakeId({
          region: Math.floor(Math.random() * 100) + 10,
          worker: 2,
        });
      },
      {
        message: 'region must be less than 10',
      }
    );
  });
  it('worker must be less than 100', () => {
    assert.throws(
      () => {
        new flakeId({
          region: 1,
          worker: Math.floor(Math.random() * 1e3) + 100,
        });
      },
      {
        message: 'worker must be less than 100',
      }
    );
  });
  it('return unique id', () => {
    const flake = new flakeId({ id: 1 });
    let pre = 0;
    for (let i = 0; i < 1e4; i++) {
      let cur = flake.next();
      assert(cur > pre);
      pre = cur;
    }
  });
  it('return unique id with callback', () => {
    const flake = new flakeId({ id: 1 });
    let pre = 0;
    for (let i = 0; i < 1e4; i++) {
      flake.next((_err, id) => {
        let cur = id;
        assert(cur > pre);
        pre = cur;
      });
    }
  });
  it('overflow without callback', () => {
    const flake = new flakeId({ id: 1, maxSeqCount: 5 });
    assert.throws(
      () => {
        for (let i = 0; i < 10; i++) {
          flake.next();
        }
      },
      {
        message: 'sequence overflow',
      }
    );
  });
  it('overflow with callback', () => {
    const flake = new flakeId({ id: 1, maxSeqCount: 5 });
    let pre = 0;
    for (let i = 0; i < 10; i++) {
      flake.next((_err, id) => {
        let cur = id;
        assert(cur > pre);
        pre = cur;
      });
    }
  });
});
