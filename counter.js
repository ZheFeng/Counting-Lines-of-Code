
var keys = ["source"];

var nonEmpty    = /[^\s]/;
var endOfLine   = /$/m;
var newLines    = /\n/g;
var emptyLines  = /^\s*$/mg;

var regex = {
  single: /\/{2}/,
  start: /\/\*+/,
  stop: /\*\/{1}/
}



var lines = function(code, reg) {
  var lines = code.match(reg);
  return lines != null ? lines.length : 0;
};
var emptyLns = function(code) {
  return lines(code, emptyLines);
};
var newLns = function(code) {
  return lines(code, newLines);
};

var countMixed = function(res, lines, idx, startIdx, match) {
  var last = res.last;
  notEmpty = nonEmpty.exec(lines[0])
  if ( notEmpty && ((last != null ? last.stop : void 0) === idx || startIdx === idx)) {
    res.mixed.push({
      start: idx,
      stop: idx
    });
  }
  if ((match != null) && nonEmpty.exec(lines.slice(-1)[0].substr(0, match.index))) {
    return res.mixed.push({
      start: startIdx,
      stop: startIdx
    });
  }
};

var getStop = function(comment, type) {
  return comment.match((function() {
    switch (type) {
      case 'single':
        return endOfLine;
      case 'block':
        return regex.stop;
    }
  })());
};

var getType = function(single, start) {
  if (single && !start) {
    return 'single';
  } else if (start && !single) {
    return 'block';
  } else {
    if (start.index <= single.index) {
      return 'block';
    } else {
      return 'single';
    }
  }
};

var matchIdx = function(m) {
  return m.index + m[0].length;
};
var countComments = function(code) {
  var myself = function(res, code, idx) {
    if (code === '') {
      return res;
    }
    if (code[0] === '\n') {
      return function() {
        return myself(res, code.slice(1), ++idx);
      };
    }
    var start = regex.start.exec(code);
    var single = regex.single.exec(code);
    if (!(start || single)) {
      countMixed(res, code.split('\n'), idx);
      return res;
    }
    var type = getType(single, start);
    var match = (function() {
      switch (type) {
        case 'single':
          return single;
        case 'block':
          return start;
      }
    })();
    var cStartIdx = matchIdx(match);
    var comment = code.substring(cStartIdx);
    var lines = code.substring(0, match.index).split('\n');
    var startIdx = lines.length - 1 + idx;
    var stop = getStop(comment, type);
    if (!stop) {
      res.error = true;
      return res;
    }
    var empty = emptyLns(code.substring(match.index, cStartIdx + matchIdx(stop)));
    comment = comment.substring(0, stop.index);
    var len = newLns(comment);
    var splitAt = cStartIdx + comment.length + stop[0].length;
    code = code.substring(splitAt);
    countMixed(res, lines, idx, startIdx, match);
    res.last = {
      start: startIdx,
      stop: startIdx + len,
      empty: empty
    };
    res[type].push(res.last);
    return function() {
      return myself(res, code, startIdx + len);
    };
  };
  return trampoline(myself({
    single: [],
    block: [],
    mixed: []
  }, code, 0));
};



var trampoline = function(next) {
  while (typeof next === 'function') {
    next = next();
  }
  return next;
};
var lineSum = function(comments) {
  var sum = 0;
  var i = 0;
  for(; i < comments.length; i++){
    var comment = comments[i];
    d = (comment.stop - comment.start) + 1;
    if (comments[i + 1] && comments[i + 1].start === comment.stop){
      d--;
    }
    sum += d
  }
  return sum;
}

var counter = function(code) {
  if (typeof code != "string"){
    return 0;
  }
  code = code.replace(/\r\n|\r/g, '\n')
  if (code.slice(-1) === '\n') {
    code = code.slice(0, -1);
  }
  var total = (1 + newLns(code)) || 1;
  var empty = emptyLns(code);
  var res = countComments(code);
  var single = lineSum(res.single);
  var block = lineSum(res.block);
  var comment = block + single;
  var mixed   = lineSum(res.mixed);
  var blockEmpty = 0;
  for (var i = 0; i < res.block.length; i++){
    blockEmpty += res.block[i].empty;
  }
  var source = total - comment - empty + blockEmpty + mixed;
  return source;
}

module.exports = exports = counter;
