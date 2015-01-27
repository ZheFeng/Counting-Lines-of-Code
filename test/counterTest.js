var expect = require("chai").expect;
var fs = require("fs");
var path = require("path");
var counter = require("../index");

describe('Line Counter', function() {
  it('should be able to detect single line comment', function() {
    var file = path.join(__dirname, "fixtures/singleComment.js")
    var code = fs.readFileSync(file, {encoding: "UTF8"});
    expect(counter(code)).to.equal(4)
  });
  it('should be able to detect block comment', function() {
    var file = path.join(__dirname, "fixtures/blockComment.js")
    var code = fs.readFileSync(file, {encoding: "UTF8"});
    expect(counter(code)).to.equal(5)
  });
  it('should be able to detect empty line', function() {
    var file = path.join(__dirname, "fixtures/emptyLine.js")
    var code = fs.readFileSync(file, {encoding: "UTF8"});
    expect(counter(code)).to.equal(5)
  });
  it('should be able to detect empty block comment', function() {
    var file = path.join(__dirname, "fixtures/emptyblockComment.js")
    var code = fs.readFileSync(file, {encoding: "UTF8"});
    expect(counter(code)).to.equal(5)
  });
  it('should be able to detect comment nest in comment', function() {
    var file = path.join(__dirname, "fixtures/nestComment.js")
    var code = fs.readFileSync(file, {encoding: "UTF8"});
    expect(counter(code)).to.equal(5)
  });
  it('should be able to detect mixed comment', function() {
    var file = path.join(__dirname, "fixtures/mixedComment.js")
    var code = fs.readFileSync(file, {encoding: "UTF8"});
    expect(counter(code)).to.equal(5)
  });
});
