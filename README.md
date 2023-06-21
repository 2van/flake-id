# How to use

```js
const flakeId = require('flake-id');
const flake = new flakeId();

const newId = flake.next();
// or
flake.next((err, id) => {
  console.log(id);
});
```
