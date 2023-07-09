# PetalFetch

Welcome to PetalFetch, a delightful and lightweight JavaScript library that makes HTTP requests a breeze! This library, designed to work seamlessly in both Node.js and the browser environment, doesn't depend on any other external libraries. With PetalFetch, you can effortlessly retrieve data from APIs and handle errors with ease. So why wait? Let's dive into the enchanting world of PetalFetch and explore its magic!

## Installation

To install PetalFetch, use npm with the following command:

```terminal
npm install --save petalfetch
```

## Usage

Start by importing the `createPetal` function from the PetalFetch library into your JavaScript file:

```javascript
const createPetal = require('petalfetch');
```

The `createPetal` function is a factory function that creates instances of PetalFetch. These instances are equipped with methods for making HTTP requests and managing your API interactions.

## Getting Started

To start with PetalFetch, first, invoke the `createPetal` function to create an instance. It accepts a configuration object that sets the default parameters for your HTTP requests:

```javascript
const petal = createPetal({
  baseurl: 'https://api.beesrus.com', // Default base URL for all requests
  timeout: 5000, // Default timeout in milliseconds
  headers: {
    'Content-Type': 'text/html',
    'Authorization': 'Bearer <YOUR_TOKEN>', // A secret code for accessing the hive
  },
  responseType: 'json', // Default response type
  handleErrors: true, // Default error handling strategy
  logErrors: true, // When `handleErrors` is true an an error is created, also automatically log it
});
```

Two key properties are `baseurl` and `handleErrors`:

- `baseurl` prepends its value to your relative URLs in each PetalFetch request.
- `handleErrors` guides the error handling strategy. When set to `true`, PetalFetch logs and returns errors, preventing them from being thrown.

These are initial explanations, and you will find a more comprehensive discussion on each of these properties in the following sections.

## Making Requests

PetalFetch provides several methods for making HTTP requests: `get`, `post`, `put`, `patch`, `delete`, and the all-purpose `request`.

### GET Request

```javascript
const options = {
  baseurl: 'https://sevenhalls.com',
  query: {
    limit: 30,
    magicLevel: 'Third'
  },
};

// https://sevenhalls.com/books?limit=30&magicLevel=Third
const [error, response] = await petal.get('/books', options);
```

### POST Request

```javascript
const options = {
  body: {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    name: 'Magical potion',
    ingredients: ['unicorn tears', 'dragon scales'],
    createdDate: 1688569673780,
  },
  headers: {
    'Spell': 'Wingardium Leviosa'
  }
}

const [catastrophe, marvel] = await petal.post(url, options);

if (!catastrophe) {
  console.log('Magical transformation complete! Response:', marvel);
}
```

### PUT Request

```javascript
const [glitch, magic] = await petal.put(url, options);

if (!glitch) {
  console.log('Abracadabra! Response:', magic);
}
```

### PATCH Request

```javascript
const [mischief, wonder] = await petal.patch(url, options);

if (!mischief) {
  console.log('Hocus Pocus! Response:', wonder);
}
```

### DELETE Request

```javascript
const [catastrophe, marvel] = await petal.delete(url, options);

if (!error) {
  console.log('Response:', response);
}
```

### General Request

You can employ `request` to make any HTTP requests with the petal instance. Just plug in the appropriate values for url and options for your case.

```javascript
const options = {
  url: 'https://weanimals.com/login', // The enchanted realm of WeAnimals
  method: 'POST', // Summoning the magical POST method
  body: {
    username: 'mrfastwings', // The username of the swift and nimble
    password: 'nectarlovers70', // The secret password of the honey connoisseurs
  },
};

const [glitch, wonder] = await petal.request(options);

if (!glitch) {
  console.log('Mystical wonders await! Response:', wonder);
}
```

## Handling Errors

PetalFetch provides flexible error handling options through the `handleErrors` configuration:

1. When `handleErrors` is set to `false` (default): Any error that occurs during the request will be thrown as an exception. You can catch these exceptions using `try/catch`.

```javascript
try {
  // With handleErrors set to false, an error during the request will throw an exception
  const response = await petal.get('/mysteriousPath', { handleErrors: false });
  console.log('Response:', response);
} catch (error) {
  console.log('An error occurred:', error);
}
```

2. When `handleErrors` is set to `true`: Instead of throwing exceptions, PetalFetch resolves requests with an array of two elements. If an error occurs, the first element represents the error, and the second element is null. If the request is successful, the first element is null, and the second element contains the server response.

```javascript
// If an error occurs, it's represented in the first element of the resolved array
const [error, response] = await petal.get('/mysteriousPath', { handleErrors: true });

if (!error) {
  console.log('Response:', response);
}
```

The `handleErrors` option empowers you with flexible error handling. Opt to let PetalFetch resolve errors as array responses, saving you from wrapping every API request in a try-catch. Or, manage errors your way with exception handling. This control allows you to streamline your code to match your project's needs. Your coding journey, your choice!

## Tweaking Defaults

PetalFetch allows instance-level customization, perfect for APIs with specific requirements. For example, by setting the `baseurl` option, you can avoid repeating the base URL in every request:

```javascript
const petal = createPetal({
  baseurl: 'http://enchanted-forest.com', // The mystical Enchanted Forest
});
```

With this, a `petal.get('/magical-creature')` call is equivalent to requesting 'http://enchanted-forest.com/magical-creature'. This not only shortens your code, but also makes it more manageable.

You're free to modify the default settings even after creating an instance of PetalFetch:

```javascript
petal.setDefaults({ headers: { 'Authorization': 'Bearer <YOUR_TOKEN>' } });
```

Do note that setting defaults for `body`, `headers`, or `query` completely overrides the previous defaults. Yet, the `'Content-Type'` header will stay as `'application/json'` unless you override it explicitly.

Keep in mind that any options specified in the request will merge with the defaults and take precedence over them. This allows you to fine-tune each request according to its specific requirements.

## Response Type

You can specify the expected response type using the `responseType` option. The following types are supported: `json`, `text`, and `blob`. Here's an example of how responses differ based on the type chosen:

JSON response:

```javascript
{
  "name": "Rose",
  "color": "Red"
}
```

Text response:

```javascript
"name: Rose, color: Red"
```

## File Upload

PetalFetch supports file uploads within the browser environment. Use the `uploadFiles` function to send a POST request with multiple files included in the body as `multipart/form-data`.

In your web page, create a portal to the realm of file uploads:

```html
<!DOCTYPE html>
<html>
  <body>
    <form>
      <input type="file" id="fileInput" multiple>
      <button type="button" onclick="flutter()">Flutter!</button>
    </form>

    <script src="petalfetch.js"></script> <!-- Replace with the actual path to your API JavaScript file -->
    <script>
      const petal = createPetal({ handleErrors: true });

      async function flutter() {
        const portal = document.getElementById('fileInput');
        const filesToFlutter = Array.from(portal.files);

        const [ mischief, wondrousFind ] = await petal
          .uploadFiles('http://localhost:3000/uploads', filesToFlutter);

        if (!mischief) {
          console.log('Files fluttered successfully:', wondrousFind);
        } else {
          console.error('Failed to flutter files:', mischief);
        }
      }
    </script>
  </body>
</html>
```
Please note that, for now, the enchantment of file uploads from a Node.js environment is not supported. Stay tuned for future updates!

## API Reference

This section provides a concise list of all the methods provided by PetalFetch, their parameters, and return types.

- `createPetal(defaults: Object)`: Returns a new PetalFetch instance.
- `petal.get(url: String, options: Object)`: Makes a GET request.
- `petal.post(url: String, options: Object)`: Makes a POST request.
- `petal.put(url: String, options: Object)`: Makes a PUT request.
- `petal.patch(url: String, options: Object)`: Makes a PATCH request.
- `petal.delete(url: String, options: Object)`: Makes a DELETE request.
- `petal.request(options: Object)`: Makes a request of any type.
- `petal.setDefaults(options: Object)`: Updates the default settings for all requests
- `petal.uploadFiles(url: String, files: [ FormData ], options: Object)`: Uploads a list of files to an endpoint

When `handleErrors` is `true`, please note that all request methods return a Promise that resolves to an array of two elements: `[error, response]`. If the request is successful, `error` will be `null` and `response` will contain the server's response. If the request fails, `error` will contain the error and `response` will be `null`.

## Conclusion

With the PetalFetch library, making HTTP requests is as delightful as a walk through a blooming garden. Its easy-to-use API and flexible customization options make it a powerful tool for any JavaScript project. Try it out and let the magic of PetalFetch make your coding journey more enjoyable!

Happy coding!

### License

This project is licensed under the MIT License. Refer to the LICENSE file for more details.
