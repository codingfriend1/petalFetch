function createPetal(settings = {}) {

  // Constants representing the HTTP methods.
  const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE'
  };

  const CONTENT_TYPE_JSON = 'application/json';
  const CONTENT_TYPE_URL_ENCODED = 'application/x-www-form-urlencoded';
  const isBrowser = typeof window !== 'undefined';

  let defaults = {
    headers: {
      'content-type': CONTENT_TYPE_JSON,
    },
    responseType: 'json',
    queryFormatter: 'URLSearchParams'
  };

  defaults = getOptions(settings);

  let https;
  if(!isBrowser) {
    https = require('https');
  }

  /**
   * Generates a detailed error message for HTTP requests.
   *
   * @param {number} statusCode - The HTTP status code of the response.
   * @param {object} body - The response body.
   * @param {string} url - The requested URL.
   * @param {object} options - The options used for the request.
   * @param {string} method - The HTTP method used for the request.
   * @return {string} - The detailed error message.
   */
  class PetalError extends Error {
    constructor(status, body, config) {
      super(`${config.method}: ${config.url}\nStatus Code: ${status}\n${JSON.stringify(body, null, 2)}`);
      this.method = config.method;
      this.status = status;
      this.url = config.url;
      this.body = body;
    }
  }

  // Returns the option value if it exists; otherwise, returns the default value.
  function getOrDefault(optionValue, defaultValue) {
    return optionValue !== undefined ? optionValue : defaultValue;
  }

  // Processes headers to ensure all keys are in lowercase.
  function processHeaders(headers) {
    return Object.keys(headers || {}).reduce((acc, key) => {
      acc[key.toLowerCase()] = headers[key];
      return acc;
    }, {});
  }

  // Determines the appropriate body value based on various conditions.
  function determineBody(options, merge) {
    // If in a browser context and body is FormData, or if body is a string, or if merging isn't required
    if (isBrowser && options.body instanceof FormData || typeof options.body === 'string' || !merge) {
      return options.body || defaults.body;
    } else {
      return {
        ...defaults.body, 
        ...(options.body || {})
      }
    }
  }

  // Extracts and returns default option values safely.
  function getOptions(options = {}, merge = false) {
    return {
      url: getOrDefault(options.url, defaults.url),
      baseurl: getOrDefault(options.baseurl, defaults.baseurl),
      method: getOrDefault(options.method, defaults.method),
      timeout: getOrDefault(options.timeout, defaults.timeout),
      logErrors: getOrDefault(options.logErrors, defaults.logErrors),
      responseType: getOrDefault(options.responseType, defaults.responseType) || 'json',
      queryFormatter: getOrDefault(options.queryFormatter, defaults.queryFormatter),
      handleErrors: getOrDefault(options.handleErrors, defaults.handleErrors),

      query: merge ? {
        ...defaults.query,
        ...options.query
      } : getOrDefault(options.query, defaults.query) || {},

      headers: merge ? {
        'content-type': CONTENT_TYPE_JSON,
        ...defaults.headers,
        ...processHeaders(options.headers)
      } : {
        'content-type': CONTENT_TYPE_JSON,
        ...processHeaders(options.headers || defaults.headers)
      },

      body: determineBody(options, merge)
    };
  }

  /**
   * Parse response body based on response type.
   */
  function parseBody(body, responseType) {
    switch (responseType) {
      case 'json':
        try {
          return JSON.parse(body);
        } catch (e) {
          return body;
        }
      case 'text':
        return body.toString();
      case 'blob':
        return new Blob([body]);
      default:
        return body.toString();
    }
  }

  function handleErrors(config, error) {
    if(config.handleErrors) {
      if(config.logErrors === true) {
        console.error(error)
      }
      return [ error, null ];
    } else {
      throw error;
    }
  }

  /**
   * Handle API response, parse body and check status code.
   */
  function handleResponse(res, body, config) {

    let parsedBody = parseBody(body, config.responseType);

    const status = isBrowser ? res.status : res.statusCode;

    if (status >= 200 && status < 300) {

      return config.handleErrors ? [ null, parsedBody ]: parsedBody;

    } else {

      return handleErrors(config, new PetalError(status, parsedBody, config));
      
    }
  }

  function concatenateURL({ baseurl = '', url = '' }) {
    if(baseurl && url) {
      return`${baseurl}/${url}`.replace(/([^:]\/)\/+/g, "$1");
    } else {
      return url
    }
  }

  // Function to format query parameters based on the provided format option
  function formatQueryParams(obj, format = 'URLSearchParams') {
    if (format === 'URLSearchParams') {
      const params = new URLSearchParams();

      const appendQueryParam = (key, value) => {
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            appendQueryParam(`${key}[${index}]`, item);
          });
        } else if (typeof value === 'object' && value !== null) {
          for (const subKey in value) {
            if (Object.prototype.hasOwnProperty.call(value, subKey)) {
              appendQueryParam(`${key}[${subKey}]`, value[subKey]);
            }
          }
        } else {
          params.append(key, value);
        }
      };

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          appendQueryParam(key, obj[key]);
        }
      }

      return params.toString();
    } else if (typeof format === 'function') {
      return format(obj);
    } else {
      throw new Error(`Unsupported query parameter format: ${format}`);
    }
  }

  function buildURLWithQueryParams(config) {
    const query = formatQueryParams(config.query, config.queryFormatter);
    return query ? `${config.url}?${query}` : config.url;
  }

  async function httpRequest(method, url, options) {

    options.method = method;
    options.url = url

    let config = getOptions(options, true);
    config.url = concatenateURL(config);

    if(!config.url) {
      return handleErrors(config, new Error(`Missing 'url'`));
    }

    if(!config.method) {
      return handleErrors(config, new Error(`Missing 'method'`));
    }

    const urlWithQuery = buildURLWithQueryParams(config);

    // Include body in fetch options for relevant methods.
    if (![HTTP_METHODS.GET, HTTP_METHODS.DELETE].includes(config.method)) {
      if(isBrowser && config.body instanceof FormData) {
        delete config.headers['content-type'];
      } else if (config.body && Object.keys(config.body).length) {
        if(config.headers['content-type'] === CONTENT_TYPE_JSON) {
          config.body = JSON.stringify(config.body);
        } else if (config.headers['content-type'] === CONTENT_TYPE_URL_ENCODED) {
          config.body = formatQueryParams(config.body, config.queryFormatter)
        }
        
      } else {
        delete config.body;
      }
    } else {
      delete config.body;
    }

    if (isBrowser) {

      let timeout
      if(config.timeout) {
        const controller = new AbortController();
        timeout = setTimeout(() => {
          controller.abort();
        }, config.timeout);
        config.signal = controller.signal
      }

      return fetch(urlWithQuery, config)
        .then(async (response) => {
          try {
            let body = await response[config.responseType]()
            return handleResponse(response, body, config)
          } catch(err) {
            return handleErrors(config, err);
          }
        })
        .catch(err => handleErrors(config, err))
        .finally(() => clearTimeout(timeout))

    } else {

      return new Promise((resolve, reject) => {
        const req = https.request(urlWithQuery, config, (res) => {
          let data = '';

          res.on('data', (chunk) => data += chunk);

          req.on('timeout', () => req.abort());

          res.on('end', () => {
            try {
              const response = handleResponse(res, data, config);
              resolve(response);
            } catch(err) {
              reject(err);
            }            
          });
        });

        req.on('error', reject);

        if (config.body) {
          if (config.body instanceof require('stream').Readable) {
            config.body.pipe(req);
          } else {
            req.write(config.body);
          }
        }

        if(config.timeout) {
          req.setTimeout(config.timeout);
        }

        req.end();
      })
    }
  }

  /**
   * Upload files to server (browser only).
   */
  function uploadFiles(url, files, options = {}) {
    if (!isBrowser) {
      throw new Error(`'uploadFiles()' is not supported in Node.js environments at this time.`);
    }

    options.url = url
    let config = getOptions(options, true)
    config.url = concatenateURL(config);

    let formData = new FormData();
    files.forEach((file, index) => {
      formData.append(options.name ? `${options.name}${index + 1}` : `file${index + 1}`, file);
    });

    config.body = formData

    return httpRequest(config.method || HTTP_METHODS.POST, config.url, config);
  }

  return {
    get: (url, options = {}) => httpRequest(HTTP_METHODS.GET, url, options),
    post: (url, options = {}) => httpRequest(HTTP_METHODS.POST, url, options),
    put: (url, options = {}) => httpRequest(HTTP_METHODS.PUT, url, options),
    patch: (url, options = {}) => httpRequest(HTTP_METHODS.PATCH, url, options),
    delete: (url, options = {}) => httpRequest(HTTP_METHODS.DELETE, url, options),
    request: (options = {}) => httpRequest(options.method, options.url, options),
    uploadFiles,
    setDefaults: (options = {}) => { defaults = getOptions(options); },
    patchDefaults: (options = {}) => { defaults = getOptions(options, true); },
  };
}

// Code for browsers
if (typeof window !== 'undefined') {
  window.createPetal = createPetal;
}

// Code for Node.js
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = createPetal;
}
