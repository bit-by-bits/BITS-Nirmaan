(function () {
  "use strict";

  const createForm = (action, data) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;

    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const setLocationHref = (url) => {
    if (typeof url === "function") {
      // Deprecated -- instead, override
      // allauth.facebook.onLoginError et al directly.
      url();
    } else {
      window.location.href = url;
    }
  };

  const allauth = (window.allauth = window.allauth || {});
  const fbSettings = JSON.parse(
    document.getElementById("allauth-facebook-settings").innerHTML
  );
  let fbInitialized = false;

  allauth.facebook = {
    init: (opts) => {
      this.opts = opts;

      window.fbAsyncInit = () => {
        FB.init(opts.initParams);
        fbInitialized = true;
        allauth.facebook.onInit();
      };

      (function (d) {
        const js = d.createElement("script");
        const id = "facebook-jssdk";
        if (d.getElementById(id)) {
          return;
        }
        js.id = id;
        js.async = true;
        js.src = opts.sdkUrl;
        d.getElementsByTagName("head")[0].appendChild(js);
      })(document);
    },

    onInit: () => {},

    login: (nextUrl, action, process, scope) => {
      const self = this;
      if (!fbInitialized) {
        const url =
          `${this.opts.loginUrl}?next=${encodeURIComponent(nextUrl)}` +
          `&action=${encodeURIComponent(action)}` +
          `&process=${encodeURIComponent(process)}` +
          `&scope=${encodeURIComponent(scope)}`;
        setLocationHref(url);
        return;
      }
      if (action === "reauthenticate" || action === "rerequest") {
        this.opts.loginOptions.auth_type = action;
      }
      if (scope !== "") {
        this.opts.loginOptions.scope = scope;
      }

      FB.login((response) => {
        if (response.authResponse) {
          self.onLoginSuccess(response, nextUrl, process);
        } else if (
          response &&
          response.status &&
          ["not_authorized", "unknown"].includes(response.status)
        ) {
          self.onLoginCanceled(response);
        } else {
          self.onLoginError(response);
        }
      }, self.opts.loginOptions);
    },

    onLoginCanceled: (/* response */) => {
      setLocationHref(this.opts.cancelUrl);
    },

    onLoginError: (/* response */) => {
      setLocationHref(this.opts.errorUrl);
    },

    onLoginSuccess: (response, nextUrl, process) => {
      const data = {
        next: nextUrl || "",
        process: process,
        access_token: response.authResponse.accessToken,
        expires_in: response.authResponse.expiresIn,
        csrfmiddlewaretoken: this.opts.csrfToken,
      };

      createForm(this.opts.loginByTokenUrl, data);
    },

    logout: (nextUrl) => {
      const self = this;
      if (!fbInitialized) {
        return;
      }
      FB.logout((response) => {
        self.onLogoutSuccess(response, nextUrl);
      });
    },

    onLogoutSuccess: (response, nextUrl) => {
      const data = {
        next: nextUrl || "",
        csrfmiddlewaretoken: this.opts.csrfToken,
      };

      createForm(this.opts.logoutUrl, data);
    },
  };

  allauth.facebook.init(fbSettings);
})();
