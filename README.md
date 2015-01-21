# Counting Lines of Code

```
npm start
```
The output will be the sample code and the count number
```
> Counting-Lines-of-Code@1.0.0 start /Users/zhefeng/development/myob/Counting-Lines-of-Code
> node .

Code:

/*
  This is a comment block
 */
// This is a single line comment
/* block empty

*/
var test = function(){
  var i = 0; //this is a inline comment
  return /* this is a inline coment */ i;
}
// This is a single line comment
var test2 = 0;

Lines count: 5
```
