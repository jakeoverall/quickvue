class ResourceError extends Error {
  constructor(msg, response) {
    super(msg);
    this.response = response;
    this.status = response.status;
  }
}
class ResourceTimeout extends Error {
  constructor(msg, url) {
    super(msg);
    this.url = url;
  }
}

export class Resources {
  constructor({
    baseURL = "",
    headers = {},
    query = "",
    timeout = 8000,
    onRequest = (url, options) => {},
    onComplete = data => {},
    onError = err => {},
    showProgress = false
  }) {
    this.baseURL = baseURL;
    this.defaultHeaders = headers;
    this.defaultQuery = query;
    this.timeout = timeout;
    this.onRequest = onRequest;
    this.onComplete = onComplete;
    this.onError = onError;
    this.showProgress = showProgress;
    if (this.showProgress) {
      let style = document.createElement("style");
      style.textContent = `
      #___FETCH__PROGRESS___{
        position: "fixed";
        top: 0;
        left: 0;
        right: 0;
        width: 0;
        height: 2px;
        background: purple;
      }
  `;
      document.head.appendChild(style);
    }
    if (this.defaultQuery && this.defaultQuery[0] != "?") {
      this.defaultQuery = "?" + this.defaultQuery;
    }
  }
  async request(url, options = {}) {
    try {
      if (!url.includes("//")) {
        url = this.baseURL + (url[0] == "/" ? url : "/" + url);
        url += this.defaultQuery ? this.defaultQuery : "";
      }
      this.showProgressBar();
      let controller = new AbortController();
      let signal = controller.signal;
      this.onRequest(url, options);

      let res = fetch(url, {
        signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...this.defaultHeaders
        },
        ...options
      });

      signal.onabort = event => {
        let err = new ResourceTimeout("[REQUEST_FAILED] Timeout", url);
        this.hideProgressBar();
        this.onError(err);
        throw err;
      };
      setTimeout(() => {
        controller.abort();
      }, this.timeout);
      let response = await res;
      let json = await response.json();
      if (response.ok) {
        this.hideProgressBar();
        this.onComplete(json);
        return json;
      }
      let err = new ResourceError(json.message, res);
      this.onError(err);
      throw err;
    } catch (e) {
      this.hideProgressBar();
      throw e;
    }
  }

  showProgressBar() {
    if (this.showProgress) {
      let w = 100;
      let d = document.createElement("div");
      d.id = "___FETCH__PROGRESS___";
      document.body.prepend(d);

      let t = setInterval(() => {
        w += 100;
        let progress = w / (this.timeout / 100);
        if (progress > 100) {
          progress = 100;
        }
        d.style.width = progress + "%";
      }, 100);
      setTimeout(() => {
        w = this.timeout;
        clearInterval(t);
        d.remove();
      }, this.timeout);
    }
  }
  hideProgressBar() {
    if (this.showProgress) {
      let d = document.getElementById("___FETCH__PROGRESS___");
      if (d && d.remove) {
        d.remove();
      }
    }
  }

  async get(url) {
    try {
      return await this.request(url);
    } catch (e) {
      throw e;
    }
  }
  async post(url, data = {}) {
    try {
      return await this.request(url, {
        method: "POST",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  async put(url, data = {}) {
    try {
      return await this.request(url, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  async delete(url) {
    try {
      return await this.request(url, {
        method: "DELETE"
      });
    } catch (e) {
      throw e;
    }
  }

  // STATIC METHODS

  static async request(url, options = {}) {
    try {
      if (!url.includes("//")) {
        url = url[0] == "/" ? url : "/" + url;
      }

      let controller = new AbortController();
      let signal = controller.signal;
      let res = fetch(url, {
        signal,
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        },
        ...options
      });

      signal.onabort = event => {
        throw new ResourceTimeout("[REQUEST_FAILED] Timeout", url);
      };
      setTimeout(() => {
        controller.abort();
      }, 10000);
      let response = await res;
      let json = await response.json();
      if (response.ok) {
        return json;
      }
      throw new ResourceError(json.message, res);
    } catch (e) {
      throw e;
    }
  }

  static async get(url) {
    try {
      return await this.request(url);
    } catch (e) {
      throw e;
    }
  }
  static async post(url, data = {}) {
    try {
      return await this.request(url, {
        method: "POST",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  static async put(url, data = {}) {
    try {
      return await this.request(url, {
        method: "PUT",
        body: JSON.stringify(data)
      });
    } catch (e) {
      throw e;
    }
  }
  static async delete(url) {
    try {
      return await this.request(url, {
        method: "DELETE"
      });
    } catch (e) {
      throw e;
    }
  }
}
