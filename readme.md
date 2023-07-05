# PetalFetch

PetalFetch is a JavaScript library that allows you to make HTTP requests to APIs in both browser and Node.js environments using the built-in `fetch` and `https` libraries. By default returns responses in JSON.

# Installation

To install the library, you can use npm:

```shell
npm install --save petalfetch
```

## Usage
First, import the library in your JavaScript file:

```javascript
const createPetal = require('petalfetch');
```

## Creating a Petal Instance
To create an instance of petal, use the createPetal function:

```javascript
const petal = createPetal();
```

You can also pass default headers and responseType that will be sent with every request:

```javascript
const petal = createPetal({
  baseurl: 'https://api.defaulturl.com', // Base URL to be prefixed to every request
  method: 'GET', // Default HTTP method for every request
  timeout: 5000, // Default timeout for every request (5 seconds)
  headers: {
    'Authorization': 'Bearer <YOUR_TOKEN>' // Default headers for every request
  },
  responseType: 'json', // Default response type, could also be 'blob' or 'text'
  handleErrors: true, // Return instead of throw errors
  params: {
    limit: 30, // Default query parameters for every request
  },
  body: {
    uid: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' // Default body content for every request
  }
});
```

## Making HTTP Requests
The petal instance provides six methods for making HTTP requests: `get`, `post`, `put`, `patch`, `delete`, and the generic `request`.

**GET Request**

```javascript
const [error, response] = await petal.get(url, options);

if (!error) {
  console.log('Response:', response);
}
```
**POST Request**

```javascript
const [error, response] = await petal.post(url, options);

if (!error) {
  console.log('Response:', response);
}
```
**PUT Request**

```javascript
const [error, response] = await petal.put(url, options);

if (!error) {
  console.log('Response:', response);
}
```
**PATCH Request**

```javascript
const [error, response] = await petal.patch(url, options);

if (!error) {
  console.log('Response:', response);
}
```
**Delete Request**

```javascript
const [error, response] = await petal.delete(url, options);

if (!error) {
  console.log('Response:', response);
}
```
**Generic Request**
You can use `request` to make general HTTP requests using the petal instance. Just replace url and options with the appropriate values for your use case.

```javascript
const options = {
  url: 'https://example.com/login'
  method: 'POST',
  body: {
    username: 'john_doe',
    password: 'secretpassword',
  },
};

const [error, response] = await petal.request(options);

if (!error) {
  console.log('Response:', response);
}
```
## Updating Defaults
The `setDefaults()` method in PetalFetch allows you to define default configuration for your HTTP requests after initialization. Any defaults that you set using this method will be applied to all future requests.

Here are the options that you can set:

### baseurl

The `baseurl` option in the `petal` library allows you to set a default base URL for your HTTP requests. It's particularly useful when you are working with APIs where you repeatedly have to make requests to the same base URL.

This `baseurl` can be set during the initialization of the `petal` instance or later using the `setDefaults` method. All the requests made using the `petal` instance will prepend this base URL to the relative URLs provided in the request.

Here's a brief overview of how you can interact with `baseurl` in different scenarios:

#### Initialization

When you create a new `petal` instance, you can specify a `baseurl`:

```
javascript
const petal = createPetal({
  baseurl: 'http://example.com',
});
```

Now, whenever you make a request using `petal.get('/endpoint')`, it will automatically target 'http://example.com/endpoint'.

#### Overriding

If you want to override the `baseurl` for a specific request, you can provide a `baseurl` in the request options:

```javascript
const response = await petal.get(`/endpoint`, { baseurl: `http://localhost:4000`});
```

This request will target 'http://localhost:4000/endpoint' instead of the `baseurl` specified during the creation of the `petal` instance.

#### Updating

You can also update the `baseurl` at any time using the `setDefaults` method:

```javascript
petal.setDefaults({ baseurl: 'http://newbaseurl.com' })
```

Now, all subsequent requests made with the `petal` instance will use this new `baseurl`.

#### Unsetting

In case you need to unset the `baseurl`, you can do so by setting it to `null`:

```javascript
petal.setDefaults({ baseurl: null })
```

After this, `petal` won't prepend any base URL to your requests unless you provide one in the request options.

#### Intelligent URL Concatenation

The `baseurl` option handles URL concatenation smartly. It avoids double slashes (`//`) when the `baseurl` ends with a slash, and the URL begins with one. Similarly, if a slash is missing between the `baseurl` and the URL, `petal` automatically adds it. This feature helps in maintaining the correctness of the URLs and reduces bugs related to incorrect URL formation.

### method
The method option allows you to set a default HTTP method (like GET, POST, PUT, etc.) for your requests.

```javascript
petal.setDefaults({ method: 'POST' });
```
If you don't specify a method in a particular request, this default method will be used. It can be overridden in any specific request by providing the method option in that request.
### timeout
The timeout option allows you to set a default timeout (in milliseconds) for your requests.

```javascript
petal.setDefaults({ timeout: 5000 }); // 5 seconds
```
If you don't specify a timeout in a particular request, this default timeout will be used. It can be overridden in any specific request by providing the timeout option in that request.
### headers
The headers option allows you to specify default headers for your requests.

```javascript
petal.setDefaults({ headers: { 'Authorization': 'Bearer <YOUR_TOKEN>', } });
```
If you don't specify headers in a particular request, these default headers will be used. They can be overridden or extended in any specific request by providing the headers option in that request. Note that when both default headers and request-specific headers are present, the request-specific headers take precedence. The default `'Content-Type'` is `'application/json'` and will only be overridden by explicitly providing a new `'Content-Type'` default or request option.

### responseType
The responseType option allows you to specify the default format of the response data. It can be 'json', 'text', or 'stream'.

```javascript
petal.setDefaults({ responseType: 'json' });
```
If you don't specify a responseType in a particular request, this default responseType will be used. It can be overridden in any specific request by providing the responseType option in that request.

### handleErrors
The handleErrors option allows you to define whether the API should handle errors globally.

```javascript
petal.setDefaults({ handleErrors: true });
```
If you don't specify a handleErrors option in a particular request, this default setting will be used. It can be overridden in any specific request by providing the handleErrors option in that request.

### params
The params option allows you to specify default query parameters for your requests.

```javascript
petal.setDefaults({ params: { limit: 10 } });
```
If you don't specify params in a particular request, these default params will be used. They can be overridden or extended in any specific request by providing the params option in that request.

### body
The body option allows you to set a default body for your requests. This can be particularly useful when you need to send the same data in multiple requests.

```javascript
petal.setDefaults({ body: { uid: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' } });
```
If you don't specify a body in a particular request, this default body will be used. It can be overridden in any specific request by providing the body option in that request.

## Handling Errors with `handleErrors` Option
Our API library supports a flexible way of handling errors that might occur during your HTTP requests. By default, any HTTP status code outside the range of 200-299 will trigger a rejection of the Promise returned by the API methods (GET, POST, PUT, PATCH, DELETE). The rejection will be an instance of `APIError` which includes the status code, response body, requested URL, and the HTTP method used.

If you want to handle the errors at the API call site instead of the library automatically throwing them, you can do so by setting the `handleErrors` option to `true` either at the request level or as a default for all requests. If `handleErrors` is set to `true`, instead of rejecting the Promise on error, the library will resolve the Promise with an array, where the first element is the error and the second element is the response body.

If `handleErrors` is set at both levels, the request-level setting takes precedence.

Here's an example of using `handleErrors`:

```javascript
const petal = createPetal({ handleErrors: true }); // handleErrors set to true as a default

// If a request fails, instead of throwing, it will resolve with [error, response]
const [ err, response ] = await petal.get('https://example.com/nonexistent')

if(!err) {
  console.log(response)
}

try {
  const response = await api
    .get('https://example.com/nonexistent', { handleErrors: false })

  console.log(response)
} catch(err) {
  console.log('err', err); 
}
```
Please note, if `handleErrors` is `false` or not set and an error occurs, you should catch the error using `catch` method on the Promise or with `try/catch` to handle it, otherwise it will result in an unhandled promise rejection.

This `handleErrors` option provides flexibility in error handling based on the requirements of your application. You can either handle all errors in a uniform manner or handle them individually based on the specific API call.

## Customizing Request Options
The options parameter for each request method is an object that allows you to customize the request.

### Query Parameters
You can include query parameters by providing a params property in the options object:

```javascript
const options = {
  params: {
    page: 2,
    limit: 30,
  },
};

petal.get(url, options);
```

### Request Body
For POST and PUT requests, you can include a request body by providing a body property in the options object:

```javascript
const options = {
  body: {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    name: 'My todo item',
    updatedAt: 1688569673780
  },
};

petal.post(url, options);
```

### Response Type
You can specify the expected response type by providing a `responseType` property in the options object. The library supports the following response types:

- `"json"`: (default): Parses the response as JSON.
- `"text"`: Retrieves the response as text.
- `"blob"`: Retrieves the response as a Blob.

```javascript
const options = {
  responseType: 'json',
};

const [error, response] = await petal.get(url, options);

if (!error) {
  console.log('Response:', response);
}
```

### Custom Headers
You can include custom headers by providing a headers property in the options object:

```javascript
const options = {
  headers: {
    'Content-Type': 'text/html',
    'Authorization': 'Bearer <YOUR_TOKEN>',
  },
};

petal.get(url, options);
```

## File Upload
The library also supports file uploads in the browser. The uploadFiles function sends a POST request to the server with multiple files in the body of the request. The files are sent as multipart/form-data.

Include the following HTML in your web page:

```html
<!DOCTYPE html>
<html>
  <body>
    <form>
      <input type="file" id="fileInput" multiple>
      <button type="button" onclick="upload()">Upload</button>
    </form>

    <script src="petalfetch.js"></script> <!-- Replace with the actual path to your API JavaScript file -->
    <script>
      const petal = createPetal({ handleErrors: true, responseType: 'text' });

      async function upload() {
        const input = document.getElementById('fileInput');
        const files = Array.from(input.files);

        const [ err, response ] = await petal
          .uploadFiles('http://localhost:3000/upload', files)

        if(!err) {
          console.log('Files uploaded successfully:', response);
        } else {
          console.error('Failed to upload files:', err);
        }
      }
    </script>
  </body>
</html>
```
Here's a starter on how to receive these files in Node.js

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create the upload directory if it doesn't exist
const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExt);
    cb(null, fileName + '-' + Date.now() + fileExt);
  },
});
const upload = multer({ storage });

const app = express();
app.use(cors());

// Route for uploading files
app.post('/upload', upload.any(), async (req, res) => {
  console.log('Received files', req.files.map((file) => file.path));
  return res.send({ message: 'Files uploaded and forwarded successfully.' });
});

// Server setup
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
```

File uploads **from** Node.js is currently not supported.

### License
This project is licensed under the MIT License. See the LICENSE file for details.
