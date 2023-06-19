// 64bit, 2^64≈1.84e19，字符串长度需要20，可按一下分配
// 13 + 3 + 4:【时间戳offset 13】【1000台机器，3】【每台速度峰值1万个/ms, 4】支持58年
// 14 + 3 + 3:【时间戳offset 14】【1000台机器，3】【每台速度峰值1千个/ms, 3】支持584年
function flakeId(opt = {}) {
  let { epoch, id, region = 0, worker = 0 } = opt;
  if (id != undefined) {
    if (id >= 1e3) {
      throw new Error('id must be less than 1000');
    }
  } else {
    if (region >= 10) {
      throw new Error('region must be less than 10');
    } else if (worker >= 100) {
      throw new Error('worker must be less than 100');
    }
    id = region + '' + String(worker).padStart(2, '0');
  }
  this.genId = String(id).padStart(3, '0');
  this.epoch = epoch ?? 0;
  this.lastOffset = 0;
  this.seq = 0;
}
flakeId.prototype.next = function (cb) {
  let id = '';
  const offset = Date.now() - this.epoch;
  if (offset == this.lastOffset) {
    if (this.overflow) {
      if (cb) {
        delayTask(() => {
          this.next(cb);
        });
        return;
      } else {
        throw new Error('sequence overflow');
      }
    }
    this.seq++;
    if (this.seq >= 1e4) {
      this.seq = 0;
      this.overflow = true;
      if (cb) {
        // 放进异步任务，使其换个时间点
        delayTask(() => {
          this.next(cb);
        });
        return;
      } else {
        throw new Error('sequence overflow');
      }
    }
  } else {
    this.seq = 0;
    this.overflow = false;
  }
  this.lastOffset = offset;
  id = offset + this.genId + String(this.seq).padStart(4, '0');
  if (cb) {
    process.nextTick(cb.bind(null, null, id));
  } else {
    return id;
  }
};

function delayTask(task) {
  setTimeout(task, 1); // force delay 1ms at least.
}

module.exports = flakeId;
