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
      location="top-left" | "top-right" | "bottom-left" | "bottom-right" 
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
