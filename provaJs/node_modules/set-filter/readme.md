# set-filter

```js
import filter from 'set-filter';

const set = new Set();
set.add(1);
set.add(2);
set.add(3);

const newSet = filter(set, num => num % 2);
```
