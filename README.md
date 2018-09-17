# Installation

```
npm install redpill-rain
```

# Basic usage


```html
<!-- index.html -->

<!doctype html>
<html>
  <body>
    <div id='root'></div>
    <script src='/index.js'></script>
  </body>
</html>
```

```javascript
// index.js

import { Rainer } from 'redpill-rain';

const rainer = new Rainer({
  sourceType: 'github',
  githubUsername: 'anderspitman',
  domElementId: 'root',
})
```

For a more complete example, see `examples/github`. A live version is currently
running at
[https://anderspitman.net/apps/redpill](https://anderspitman.net/apps/redpill).
