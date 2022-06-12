window.spbp = (function () {
  const loaded = new Map();
  const modules = {
    "@rothert/spbp/modules/custom/test-button": ({ require }, exports) => {
      function onLoad(element) {
        console.log(element);
      }

      document.querySelectorAll(".test-button").forEach(onLoad);

      exports.onLoad = onLoad;
    },
  };
  return {
    require: function (module) {
      if (!loaded.has(module)) {
        if (!modules[module]) {
          throw new Error("Module " + module + " doesn't exist!");
        }
        let exports = {};
        modules[module](this, exports);
        loaded.set(module, exports);
      }
      return loaded.get(module);
    },
    loaded: loaded,
    modules: modules,
    append: function (modules) {
      Object.assign(this.modules, modules);
    },
  };
})();
