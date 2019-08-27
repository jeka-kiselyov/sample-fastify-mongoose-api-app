import Vue from 'vue';
import VueRouter from 'vue-router';
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

Vue.use(VueRouter);

const requireComponent = require.context(
  '.', /// current directory
  false, /// subdirectories
  /[\w-]+\.vue$/
);

const routes = [];

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);
  
  // Get PascalCase name of component
  const componentName = upperFirst(
    camelCase(
      // Gets the file name regardless of folder depth
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  );

  const componentConfigNormalized = componentConfig.default || componentConfig;
  if (componentConfigNormalized) {
    if (componentConfigNormalized.path) {
      const vueComponent = Vue.component(componentName, componentConfigNormalized);
      if (componentConfigNormalized.authRequired) {
        routes.push({path: componentConfigNormalized.path, component: Vue.component('AuthRequiredRoute'), props: { routeComponentName: componentName }});  
      } else {
        routes.push({path: componentConfigNormalized.path, component: vueComponent});          
      }
    }
  }
});

const router = new VueRouter({
  mode: 'history',
  routes: routes
});

export default router;
// console.log(routes);