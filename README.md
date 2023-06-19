# How to use

```js
const FlakeId = require('flake-id');

const newId = FlakeId.next();
// or
FlakeId.next((err, id) => {
  console.log(id);
});
```
