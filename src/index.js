import AuthControl from "./authConstruct";

const authControlPlugin = {
  install: (app, options) => {
    const auth = new AuthControl(options);
    app.directive("auth", {
      mounted: auth.authInMounted.bind(auth),
      updated: auth.authInUpdated.bind(auth),
    });
  },
};

export default authControlPlugin;
