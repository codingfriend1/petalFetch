const isBrowser = typeof window !== 'undefined';

const APPLICATION_JSON = 'application/json';
const APPLICATION_URL_ENCODED = 'application/x-www-form-urlencoded';


if(!isBrowser) {
  global.mocha = require('mocha');
  global.chai = require('chai');
  global.msw = require('msw/node');
  global.setupServer = msw.setupServer;
  global.rest = require('msw').rest;
} else {
  global.msw = require('msw');
  global.setupWorker = msw.setupWorker;
  global.rest = msw.rest; 
}

global.createPetal = require('../index.js');
global.assert = chai.assert;

const server_url = `https://localhost:3000`;
const defaultURL = `${server_url}/test`;


/**
 * Deep equality comparison of two objects.
 * @param {Object} obj1 - The first object.
 * @param {Object} obj2 - The second object.
 * @returns {boolean} - True if the objects are deeply equal, false otherwise.
 */
function deepEqual(obj1, obj2) {
  // If the objects are strictly equal, return true
  if (obj1 === obj2) {
    return true;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // If the number of keys is different, objects are not deeply equal
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Check each key and value recursively
  for (let key of keys1) {
    // If the key is not present in obj2 or values are not deeply equal, objects are not deeply equal
    if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // All keys and values are deeply equal
  return true;
}

describe('createPetal', function() {
  let petal;
  let server;

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(function() {
    petal = createPetal({
      headers: {
        'Custom-Header': 'CustomValue'
      }
    });
  });

  it('should create an petal object', function() {
    assert.isObject(petal);
  });

  it('should have correct methods', function() {
    assert.isFunction(petal.get);
    assert.isFunction(petal.post);
    assert.isFunction(petal.put);
    assert.isFunction(petal.patch);
    assert.isFunction(petal.delete);
    assert.isFunction(petal.request);
    assert.isFunction(petal.uploadFiles);
    assert.isFunction(petal.setDefaults);
  });

  it('should not expose internal functions and constants', function() {
    assert.isUndefined(createPetal.HTTP_METHODS);
    assert.isUndefined(createPetal.CONTENT_TYPE_JSON);
    assert.isUndefined(createPetal.PetalError);
    assert.isUndefined(createPetal.parseBody);
    assert.isUndefined(createPetal.handleResponse);
    assert.isUndefined(createPetal.handleErrorsResponse);
    assert.isUndefined(createPetal.httpRequest);
    assert.isUndefined(createPetal.uploadFiles);
  });

  it('should not pollute the global namespace', function() {
    let isHTTPMethodsDefined = false;
    let isContentTypeJSONDefined = false;
    let isPetalErrorDefined = false;
    let isParseBodyDefined = false;
    let isHandleResponseDefined = false;
    let isHandleErrorsResponseDefined = false;
    let isHttpRequestDefined = false;
    let isUploadFilesDefined = false;

    try {
      isHTTPMethodsDefined = typeof HTTP_METHODS !== 'undefined';
      isContentTypeJSONDefined = typeof CONTENT_TYPE_JSON !== 'undefined';
      isPetalErrorDefined = typeof PetalError !== 'undefined';
      isParseBodyDefined = typeof parseBody !== 'undefined';
      isHandleResponseDefined = typeof handleResponse !== 'undefined';
      isHandleErrorsResponseDefined = typeof handleErrorsResponse !== 'undefined';
      isHttpRequestDefined = typeof httpRequest !== 'undefined';
      isUploadFilesDefined = typeof uploadFiles !== 'undefined';
    } catch (error) {
      // Catch the ReferenceError if the variable or constant does not exist
    }

    assert.isFalse(isHTTPMethodsDefined);
    assert.isFalse(isContentTypeJSONDefined);
    assert.isFalse(isPetalErrorDefined);
    assert.isFalse(isParseBodyDefined);
    assert.isFalse(isHandleResponseDefined);
    assert.isFalse(isHandleErrorsResponseDefined);
    assert.isFalse(isHttpRequestDefined);
    assert.isFalse(isUploadFilesDefined);
  });

  it('should perform a GET request with query parameters', function(done) {
    const queryParams = {
      page: 3,
      limit: 50
    };

    server.use(
      rest.get(defaultURL, (req, res, ctx) => {
        if (req.url.searchParams.get('page') == queryParams.page &&
            req.url.searchParams.get('limit') == queryParams.limit) {
          return res(ctx.json({ message: 'GET request with query parameters successful' }));
        } else {
          return res(ctx.status(500), ctx.text('GET request failed'));
        }
      })
    );

    petal.get(defaultURL, {
      params: queryParams
    }).then((response) => {
      assert.deepEqual(response, { message: 'GET request with query parameters successful' });
      done();
    }).catch(done);
  });


  it('should perform a GET request', function(done) {
    server.use(
      rest.get(defaultURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'GET request successful' }));
      })
    );

    petal.get(defaultURL).then((response) => {
      assert.deepEqual(response, { message: 'GET request successful' });
      done();
    }).catch(done);
  });

  it('should perform a POST request', function(done) {
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, { test: 'data' });
        return res(ctx.status(200), ctx.json({ message: 'POST request successful' }));
      })
    );

    petal.post(defaultURL, {
      body: { test: 'data' }
    }).then((response) => {
      assert.deepEqual(response, { message: 'POST request successful' });
      done();
    }).catch(done);
  });

  it('should perform a PUT request', function(done) {
    server.use(
      rest.put(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, { test: 'data' });
        return res(ctx.status(200), ctx.json({ message: 'PUT request successful' }));
      })
    );

    petal.put(defaultURL, {
      body: { test: 'data' }
    }).then((response) => {
      assert.deepEqual(response, { message: 'PUT request successful' });
      done();
    }).catch(done);
  });

  it('should perform a PATCH request', function(done) {
    server.use(
      rest.patch(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, { test: 'data' });
        return res(ctx.status(200), ctx.json({ message: 'PATCH request successful' }));
      })
    );

    petal.patch(defaultURL, {
      body: { test: 'data' }
    }).then((response) => {
      assert.deepEqual(response, { message: 'PATCH request successful' });
      done();
    }).catch(done);
  });

  it('should perform a DELETE request', function(done) {
    server.use(
      rest.delete(defaultURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'DELETE request successful' }));
      })
    );

    petal.delete(defaultURL).then((response) => {
      assert.deepEqual(response, { message: 'DELETE request successful' });
      done();
    }).catch(done);
  });

  it('should perform a generic REQUEST', function(done) {

    const options = {
      url: defaultURL,
      method: 'PATCH'
    }

    server.use(
      rest.patch(defaultURL, (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ message: 'PATCH request successful' }));
      })
    );

    petal.request(options).then((response) => {
      assert.deepEqual(response, { message: 'PATCH request successful' });
      done();
    }).catch(done);
  });

});

describe('Query, Header, and Body', function() {
  let petal;
  let server;

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(function() {
    petal = createPetal({
      headers: {
        'Custom-Header': 'CustomValue'
      }
    });
  });

  it('should perform a PATCH request with query parameters', function(done) {

    const queryParams = {
      page: 3,
      limit: 50
    };

    server.use(
      rest.patch(defaultURL, (req, res, ctx) => {
        if (req.url.searchParams.get('page') == queryParams.page &&
            req.url.searchParams.get('limit') == queryParams.limit) {
          return res(ctx.json({ message: 'PATCH request with query parameters successful' }));
        } else {
          return res(ctx.status(500), ctx.text('PATCH request failed'));
        }
      })
    );

    petal.patch(defaultURL, {
      params: queryParams
    }).then((response) => {
      assert.deepEqual(response, { message: 'PATCH request with query parameters successful' });
      done();
    }).catch(done);
  });

  it('should perform a DELETE request with custom headers', function(done) {
    const customHeaders = {
      'Authorization': 'Bearer <token>',
      'X-Custom-Header': 'CustomValue'
    };

    server.use(
      rest.delete(defaultURL, (req, res, ctx) => {
        if (req.headers.get('Authorization') === customHeaders.Authorization &&
            req.headers.get('X-Custom-Header') === customHeaders['X-Custom-Header']) {
          return res(ctx.json({ message: 'DELETE request with custom headers successful' }));
        } else {
          return res(ctx.status(500), ctx.text('DELETE request failed'));
        }
      })
    );

    petal.delete(defaultURL, {
      headers: customHeaders
    }).then((response) => {
      assert.deepEqual(response, { message: 'DELETE request with custom headers successful' });
      done();
    }).catch(done);
  });

  it('should perform a POST request with no body content', function(done) {
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        if (!req.body) {
          return res(ctx.json({ message: 'POST request with no body content successful' }));
        } else {
          return res(ctx.status(500), ctx.json({ message: 'POST request failed' }));
        }
      })
    );

    petal.post(defaultURL).then((response) => {
      assert.deepEqual(response, { message: 'POST request with no body content successful' });
      done();
    }).catch(done);
  });

  it('should perform a POST request with body, headers, and params', function(done) {
    const requestBody = { test: 'data' };
    const requestHeaders = { 'Custom-Header': 'CustomValue', 'Header-two': 'Five'  };
    const requestParams = { id: 123 };

    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        if (deepEqual(req.body, requestBody) &&
            req.headers.get('Custom-Header') === requestHeaders['Custom-Header'] &&
            req.headers.get('Header-two') === requestHeaders['Header-two'] &&
            req.url.searchParams.get('id') === requestParams.id.toString()) {
          return res(ctx.json({ message: 'POST request with body, headers, and params successful' }));
        } else {
          return res(ctx.status(500), ctx.text('POST request failed'));
        }
      })
    );

    petal.post(defaultURL, {
      body: requestBody,
      headers: requestHeaders,
      params: requestParams
    }).then((response) => {
      assert.deepEqual(response, { message: 'POST request with body, headers, and params successful' });
      done();
    }).catch(done);
  });

});

describe(`Missing 'url' and 'method'`, function() {
  let petal;
  let server;

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(function() {
    petal = createPetal({
      headers: {
        'Custom-Header': 'CustomValue'
      },
      responseType: 'json',
      handleErrors: true
    });
  });

  it('should error when missing the URL', async function() {

    try {
      const response = await petal.get('', { handleErrors: false });
    } catch(error) {
      assert.instanceOf(error, Error);
    }
  });

  it('should error when missing the method', async function() {

    const options = {
      url: defaultURL,
      method: '',
      handleErrors: false
    };

    try {
      const response = await petal.request(options);
    } catch(error) {
      assert.instanceOf(error, Error);
    }    
  });

  it('should handle errors when missing the url', async function() {

    const [ error, response ] = await petal.get('');

    assert.instanceOf(error, Error);
    assert.isNull(response);
  });

  it('should handle errors when missing the method', async function() {

    const options = {
      url: defaultURL,
      method: ''
    }

    const [ error, response ] = await petal.request(options);

    assert.instanceOf(error, Error);
    assert.isNull(response);
  });

});


describe(`Base url`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const baseurl = `http://example.com`;
  const defaultMethod = 'POST';

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      baseurl: baseurl,
      method: defaultMethod,
    });
  });

  it('should append the url to the baseurl if one exists', async () => {
    
    server.use(
      rest.get(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: 'GET request successful' }));
      })
    );

    const response = await petal.get('/default');

    assert.deepEqual(response, { message: 'GET request successful' });
  });

  it('should use the url provided by setDefaults instead of initialization url', async () => {

    const new_url = `http://localhost:8080`
    
    server.use(
      rest.get(`${new_url}/default`, (req, res, ctx) => {
        return res(ctx.json({ message: 'GET request successful' }));
      })
    );

    petal.setDefaults({ baseurl: new_url })

    const response = await petal.request({ url: '/default', method: 'GET' });

    assert.deepEqual(response, { message: 'GET request successful' });
  });

  it('should be able to unset a baseurl', async () => {
    
    server.use(
      rest.get(`http://localhost:8080/default`, (req, res, ctx) => {
        return res(ctx.json({ message: 'GET request successful' }));
      })
    );

    console.log('should be able to unset a baseurl')

    petal.setDefaults({ baseurl: null })

    const response = await petal.get(`http://localhost:8080/default`);

    assert.deepEqual(response, { message: 'GET request successful' });
  });

  it('should be able to override the baseurl in request options', async () => {
    
    server.use(
      rest.get(`http://localhost:4000/default`, (req, res, ctx) => {
        return res(ctx.json({ message: 'GET request successful' }));
      })
    );

    const response = await petal.get(`/default`, { baseurl: `http://localhost:4000`});

    assert.deepEqual(response, { message: 'GET request successful' });
  });

  it('should avoid double // when concatenating URLs', async () => {
    
    server.use(
      rest.get(`http://localhost:4000/default`, (req, res, ctx) => {
        return res(ctx.json({ message: 'GET request successful' }));
      })
    );

    const response = await petal.get(`/default`, { baseurl: `http://localhost:4000/`});

    assert.deepEqual(response, { message: 'GET request successful' });
  });

  it('should add a missing / when concatenating the URLs', async () => {    
    server.use(
      rest.get(`http://localhost:4000/default`, (req, res, ctx) => {
        return res(ctx.json({ message: 'GET request successful' }));
      })
    );

    const response = await petal.get(`default`, { baseurl: `http://localhost:4000`});

    assert.deepEqual(response, { message: 'GET request successful' });
  });

});

describe(`Default 'method'`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const defaultMethod = 'POST';

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      url: defaultURL,
      method: defaultMethod
    });
  });

  it('should use default method if no method is provided in options', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: `POST request successful` }));
      })
    );

    const response = await petal.request();

    assert.deepEqual(response, { message: `POST request successful` });
  });

  it('should use method provided by setDefaults instead of initialization method', async () => {
    
    server.use(
      rest.patch(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: 'PATCH request successful' }));
      })
    );

    petal.setDefaults({ method: 'PATCH' })

    const response = await petal.request();

    assert.deepEqual(response, { message: 'PATCH request successful' });
  });

  it('should use provided method in options instead of default method', async () => {
    
    server.use(
      rest.put(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: 'PUT request successful' }));
      })
    );

    petal.setDefaults({ method: 'PATCH' })

    const response = await petal.request({ method: 'PUT' });

    assert.deepEqual(response, { message: 'PUT request successful' });
  });

});

describe(`responseType`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const defaultMethod = 'POST';

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      url: defaultURL,
      method: defaultMethod,
      responseType: 'text'
    });
  });

  it('should apply the default responseType when none is specified in options', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: `Text Request Successful` }));
      })
    );

    const response = await petal.request();

    assert.isString(response);
    assert.equal(response, '{"message":"Text Request Successful"}');
  });

  it('should use the responseType set by setDefaults, overriding the initialized responseType', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: 'JSON Request Successful' }));
      })
    );

    petal.setDefaults({ responseType: 'json' })

    const response = await petal.request();

    assert.deepEqual(response, { message: 'JSON Request Successful' });
  });

  it('should prioritize the responseType specified in options over the default responseType', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: 'TEXT request successful' }));
      })
    );

    petal.setDefaults({ responseType: 'json' })

    const response = await petal.request({ responseType: 'text' });

    assert.isString(response);
    assert.equal(response, '{"message":"TEXT request successful"}');
  });
});

describe(`Errors`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const defaultMethod = 'POST';

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      url: defaultURL,
      method: defaultMethod,
      handleErrors: true
    });
  });

  it('should apply the default handleErrors when none is specified in options', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Internal Server Error" }));
      })
    );

    const [ error, response ] = await petal.request();

    assert.isNull(response);
    assert.instanceOf(error, Error);
  });

  it('should use the handleErrors set by setDefaults, overriding the initialized handleErrors', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: "Internal Server Error" }));
      })
    );

    petal.setDefaults({ handleErrors: false })

    try {
      const response = await petal.request();
    } catch(error) {
      assert.instanceOf(error, Error);
    }
    
  });

  it('should prioritize the handleErrors specified in options over the default handleErrors', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.json({ message: 'JSON request successful' }));
      })
    );

    petal.setDefaults({ handleErrors: true })

    const [ error, response ] = await petal.request();

    assert.deepEqual(response, { message: 'JSON request successful' });
    assert.isNull(error);
  });

  it('should handle errors when an invalid responseType is set', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'JSON request successful' }));
      })
    );

    petal.setDefaults({ handleErrors: true, responseType: 'fake-response-type' })

    const [ error, response ] = await petal.request();

    assert.instanceOf(error, Error);
    assert.isNull(response);
  });

  it('should include method, status, url, and message in the PetalError', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: "Bad Request" }));
      })
    );

    petal.setDefaults({ handleErrors: true, responseType: 'json' })

    const [ error, response ] = await petal.request();

    assert.instanceOf(error, Error);
    assert.equal(error.status, 400);
    assert.equal(error.method, 'POST');
    assert.deepEqual(error.body, { message: "Bad Request" });
  });
});

describe(`Query Parameters`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const defaultMethod = 'POST';
  const defaultParams = { access_token: 'abcd', timestamp: 5555555 };

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      url: defaultURL,
      method: defaultMethod,
      params: defaultParams
    });
  });

  it('should use default params if no params is provided in options', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        if(req.url.searchParams.get('access_token') === 'abcd' && req.url.searchParams.get('timestamp') == 5555555) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    const response = await petal.request();

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

  it('should use params provided by setDefaults instead of initialization params', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        if(req.url.searchParams.get('access_token') === 'dcba' && req.url.searchParams.get('timestamp') == 111111111) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    petal.setDefaults({
      params: {
        access_token: 'dcba',
        timestamp: 111111111
      }
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

  it('should use provided params in options instead of default params', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        if(req.url.searchParams.get('access_token') === 'bbbb' && req.url.searchParams.get('timestamp') == 22222222) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    petal.setDefaults({
      params: {
        access_token: 'dcba',
        timestamp: 111111111
      }
    })

    const response = await petal.request({
      params: {
        access_token: 'bbbb',
        timestamp: 22222222
      }
    });

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

  it('should replace all params when setDefault sets new params', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        const searchParamsKeys = [...req.url.searchParams.keys()];

        if(req.url.searchParams.get('access_token') === 'gggg' && searchParamsKeys.length === 1 && !req.url.searchParams.get('timestamp')) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    petal.setDefaults({
      params: {
        access_token: 'gggg',
      }
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

  it('should remove all params when an empty object is provided', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        const searchParamsKeys = [...req.url.searchParams.keys()];

        if(!req.url.searchParams.get('access_token') && searchParamsKeys.length === 0) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    petal.setDefaults({
      params: {}
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

  it('should not remove params when params key is not set in setDefaults', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        if(req.url.searchParams.get('access_token') === 'abcd' && req.url.searchParams.get('timestamp') == 5555555) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    petal.setDefaults({ body: {} })

    const response = await petal.request();

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

  it('should merge and prioritize params in instance over defaults', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {

        if(req.url.searchParams.get('access_token') === 'jjjj' && req.url.searchParams.get('timestamp') == 5555555) {
          return res(ctx.json({ message: "PARAM request successful" }));
        } else {
          return res(ctx.status(500), ctx.json({ message: "PARAM request failed" }));
        }
        
      })
    );

    const response = await petal.request({ 
      params: {
        access_token: 'jjjj'
      } 
    });

    assert.deepEqual(response, { message: "PARAM request successful" });
  });

});

describe(`Body Content`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const defaultMethod = 'POST';
  const defaultBody = { token: '1234', id: '13' };

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      url: defaultURL,
      method: defaultMethod,
      body: defaultBody,
    });
  });
  
  it(`should apply the default body when no body is specified in options`, async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, defaultBody);
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    const response = await petal.request();

    assert.deepEqual(response, { message: "Body request successful" });
  });

  it('should use the body specified by setDefaults over the initial body', async () => {

    const updated_body = {
      token: 'dddd',
      timestamp: 9999
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, updated_body);
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    petal.setDefaults({
      body: updated_body
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Body request successful" });
  });

  it('should override the default body with the body provided in options', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, {
          token: 'zzzz',
          timestamp: 8888
        });
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    petal.setDefaults({
      body: {
        token: 'dcba',
        timestamp: 111111111
      }
    })

    const response = await petal.request({
      body: {
        token: 'zzzz',
        timestamp: 8888
      }
    });

    assert.deepEqual(response, { message: "Body request successful" });
  });

  it('should replace the entire body when a new one is set by setDefault', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, { token: 'gggg' });
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    petal.setDefaults({
      body: {
        token: 'gggg',
      }
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Body request successful" });
  });

  it('should discard all body content when an empty object is supplied', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.strictEqual(req.body, '')
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    petal.setDefaults({
      body: {}
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Body request successful" });
  });

  it('should retain the body content when the "body" key is not set in setDefaults', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, defaultBody);
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    petal.setDefaults({ params: {} })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Body request successful" });
  });

  it('should merge the body content and give precedence to instance content over defaults', async () => {

    const defaultbody = { access_token: 'abcd', timestamp: 5555555 };
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.deepEqual(req.body, { 
          token: '1234', 
          id: '2',
          username: 'john.doe',
          password: 'mypassword'
        });
        return res(ctx.json({ message: "Body request successful" }));
      })
    );

    const response = await petal.request({ 
      body: {
        username: 'john.doe',
        password: 'mypassword',
        id: '2'
      } 
    });

    assert.deepEqual(response, { message: "Body request successful" });
  });

});


describe(`Headers`, () => {

  let petal;

  const defaultURL = `http://example.com/default`;
  const defaultMethod = 'POST';
  const defaultHeaders = { Accept: APPLICATION_JSON, Session: 'session_id=38afes7a8; user=john' };

  if(isBrowser) {
    before(() => {
      server = setupWorker();
      server.start()
    });
    after(() => server.stop());
    afterEach(() => server.resetHandlers());
  } else {
    before(() => {
      server = setupServer();
      server.listen()
    });
    after(() => server.close());
    afterEach(() => server.resetHandlers());
  }

  beforeEach(() => {
    petal = createPetal({
      url: defaultURL,
      method: defaultMethod,
      headers: defaultHeaders
    });
  });

  it('should use default headers if no headers are provided in options', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), defaultHeaders['Accept']);
        assert.equal(req.headers.get('Session'), defaultHeaders['Session']);
        assert.equal(req.headers.get('Content-Type'), APPLICATION_JSON);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it(`should prioritize headers defined by setDefaults over the initial ones`, async () => {

    const updated_headers = {
      'Accept': 'text/plain',
      'Session': 'session_id=38afes7a8; user=jane'
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), updated_headers['Accept']);
        assert.equal(req.headers.get('Session'), updated_headers['Session']);
        assert.equal(req.headers.get('Content-Type'), APPLICATION_JSON);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({
      headers: updated_headers
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it('should replace default headers with those provided in options', async () => {
    
    const options_headers = {
      'Accept': 'application/xml',
      'Session': 'session_id=38afes7a8; user=dave'
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), options_headers['Accept']);
        assert.equal(req.headers.get('Session'), options_headers['Session']);
        assert.equal(req.headers.get('Content-Type'), APPLICATION_JSON);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({
      headers: {
        'Accept': APPLICATION_JSON,
        'Session': 'session_id=38afes7a8; user=sam'
      }
    })

    const response = await petal.request({
      headers: options_headers
    });

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it('should overwrite all headers when new ones are set by setDefault', async () => {
    
    const new_headers = {
      'Accept': 'text/csv',
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), new_headers['Accept']);
        assert.isNull(req.headers.get('Session'));
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({
      headers: new_headers
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it('should preserve the original Content-Type when setting default headers', async () => {
    
    const new_headers = {
      'Accept': 'text/csv',
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), new_headers['Accept']);
        assert.isNull(req.headers.get('Session'));
        assert.equal(req.headers.get('Content-Type'), APPLICATION_JSON);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({
      headers: new_headers
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it('should update default Content-Type if specified explicitly in setDefaults', async () => {
    
    const new_headers = {
      'Accept': 'image/jpeg',
      'Content-Type': 'image/jpeg'
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), new_headers['Accept']);
        assert.isNull(req.headers.get('Session'));
        assert.equal(req.headers.get('Content-Type'), new_headers['Content-Type']);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({
      headers: new_headers
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it('should discard all headers when an empty object is supplied', async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.strictEqual(req.headers.get('Accept'), null);
        assert.strictEqual(req.headers.get('Session'), null);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({
      headers: {}
    })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it(`should retain headers if the 'headers' key is not specified in setDefaults`, async () => {
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), defaultHeaders['Accept']);
        assert.equal(req.headers.get('Session'), defaultHeaders['Session']);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    petal.setDefaults({ params: {} })

    const response = await petal.request();

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it('should combine and give precedence to instance headers over defaults', async () => {

    const options_headers = {
      'Accept': 'text/html',
      'Authorization': 'Bearer <token>'
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Accept'), options_headers['Accept']);
        assert.equal(req.headers.get('Session'), defaultHeaders['Session']);
        assert.equal(req.headers.get('Authorization'), options_headers['Authorization']);
        assert.equal(req.headers.get('Content-Type'), APPLICATION_JSON);
        return res(ctx.json({ message: "Header request successful" }));
      })
    );

    const response = await petal.request({ 
      headers: options_headers
    });

    assert.deepEqual(response, { message: "Header request successful" });
  });

  it(`should encode 'application/x-www-form-urlencoded'`, async () => {

    const options_headers = {
      'Accept': 'text/html',
      'Authorization': 'Bearer <token>'
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Content-Type'), APPLICATION_URL_ENCODED);
        return res(ctx.json(req.body));
      })
    );

    const response = await petal.request({ 
      headers: {
        'Content-Type': APPLICATION_URL_ENCODED
      },
      body: {
        page: 1,
        limit: 10,
        searchTerms: ['photos', 'cats']
      }
    });

    assert.deepEqual(response, 'page=1&limit=10&searchTerms=photos%2Ccats');
  });

  it(`should encode 'application/json'`, async () => {

    const options_headers = {
      'Accept': 'text/html',
      'Authorization': 'Bearer <token>'
    }
    
    server.use(
      rest.post(defaultURL, (req, res, ctx) => {
        assert.equal(req.headers.get('Content-Type'), APPLICATION_JSON);
        return res(ctx.json(req.body));
      })
    );

    const response = await petal.request({ 
      headers: {
        'Content-Type': APPLICATION_JSON
      },
      body: {
        page: 1,
        limit: 10,
        searchTerms: ['photos', 'cats']
      }
    });

    assert.deepEqual(response, {page: 1, limit: 10, searchTerms: ['photos', 'cats']});
  });

});

