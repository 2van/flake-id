# Install

```bash
npm install --save @liber8/flake-id
```


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
