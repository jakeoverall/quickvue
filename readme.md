### Install QuickVue

```shell
npm i @bcwdev/quickvue
```

**_main.js_**

```javascript
import QuickVue from "@bcwdev/quickvue";

Vue.use(QuickVue);
```

**_app.js_**

```html
<template>
  <div id="app">
    <!-- 
      location="top-left" | "top-right" | "top-center" | "bottom-left" | "bottom-right" | "bottom-center" 
      -->
    <toaster location="top-right" />
    <div class="loader" v-if="loading"></div>
    <router-view />
  </div>
</template>
```

### Components

- **QuickModal:**
- **QuickCollapse:**
- **QuickView:**
- **QuickTip:**
- **QuickView:**

### Plugins

- \$debouce
- async \$confirm
- \$swal
- \$toast.
  - custom({ title: string, body?: string, type?: string, icon?: string, img?: string })
  - error(msg, icon?, title?)
  - info
  - success
  - warning
- $resource = [LightPath](https://www.npmjs.com/package/lightpath)
- $connectionMonitor

```javascript
$connectionMonitor(onConnect = (monitorElem) => {}, onDisconnect = (monitorElem) => {})
```