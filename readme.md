# PetalFetch

Welcome to PetalFetch, a delightful and lightweight JavaScript library that makes HTTP requests a breeze! This library, designed to work seamlessly in both Node.js and the browser environment, doesn't depend on any other external libraries. With PetalFetch, you can effortlessly retrieve data from APIs and handle errors with ease. So why wait? Let's dive into the enchanting world of PetalFetch and explore its magic!

## Installation

To install PetalFetch, use npm with the following command:

```shell
npm install --save petalfetch
```

## Usage

Start by importing the `createPetal` function from the PetalFetch library into your JavaScript file:

```javascript
const createPetal = require('petalfetch');
```

The `createPetal` function is a factory function that creates instances of PetalFetch. These instances are equipped with methods for making HTTP requests and managing your API interactions.

## Getting Started

To use PetalFetch, first create an instance by invoking the `createPetal` function. This function takes a configuration object as an argument, where you can set default options for your HTTP requests:

```javascript
const petal = createPetal({
  baseurl: 'https://api.beesrus.com', // Default base URL for all requests
  method: 'GET', // Default HTTP method
  timeout: 5000, // Default timeout in milliseconds
  headers: {
    'Content-Type': 'text/html',
    'Authorization': 'Bearer <YOUR_TOKEN>', // A secret code for accessing the hive
  },
  responseType: 'json', // Default response type
  handleErrors: true, // Default error handling strategy
});
```

If you provide a `baseurl` property in the configuration object, it will be prepended to your relative urls in each petal call. The `handleErrors` property determines the error handling strategy: when it's set to `true`, PetalFetch will log and return errors instead of throwing them.

## Making Requests

PetalFetch provides several methods for making HTTP requests: `get`, `post`, `put`, `patch`, `delete`, and the all-purpose `request`.

### GET Request

```javascript
const options = {
  baseurl: 'https://sevenhalls.com',
  params: {
    limit: 30,
    magicLevel: 'Third',
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

PetalFetch offers two ways to handle errors:

1. With `handleErrors` set to `true` in the instance configuration, PetalFetch will log and return errors instead of throwing them. This gives you more control over error handling. The first element in the result array will be `spellGoneWrong`, which represents the error, while the second element `wondrousResponse` holds the response when the request succeeds.
2. If you decide to disable `handleErrors` for a specific request by setting it to `false`, any error encountered during that request will be thrown as an exception, which you can gracefully catch using `try/catch`.

```javascript
const petal = createPetal({ handleErrors: true, baseurl: 'https://mysticalrealm.com' }); // Embrace the power of handling errors

// If a request encounters a hiccup, it will gracefully resolve with [spellGoneWrong, wondrousResponse]
const [spellGoneWrong, wondrousResponse] = await petal.get('/mysteriousPath');

if (!spellGoneWrong) {
  console.log('Response:', wondrousResponse);
}

try {
  const response = await petal.get('/mysteriousPath', { handleErrors: false }); // Disabling handleErrors for this request

  console.log('Response:', response);
} catch (spellGoneWrong) {
  console.log('Oh no, the spell backfired:', spellGoneWrong);
}
```

The format of the returned error is as follows:

```javascript
new PetalError() extends Error {
  method: 'POST',
  status: 400,
  url: 'https://weanimals.com/login',
  body: { message: 'Password invalid.' }
}
```

You can access these errors as shown in the Making Requests section.

This `handleErrors` option provides flexibility in how you handle errors throughout your magical coding journey. You can choose to embrace errors and handle them individually or let them gracefully flow through your code, ready to be captured when needed. The choice is yours!

## Tweaking Defaults

You can customize the default settings of PetalFetch at the instance creation stage. This can be useful when you're working with a particular API that requires specific settings.

For instance, you can set the `baseurl` option to the base URL of the API you're working with, saving you the need to repeat it in every request:

```javascript
const petal = createPetal({
  baseurl: 'http://enchanted-forest.com', // The mystical Enchanted Forest
});
```

Now, whenever you make a request like `petal.get('/magical-creature')`, the `baseurl` will be magically combined with the relative URL, guiding your request to 'http://enchanted-forest.com/magical-creature'.

You can also update your defaults after they are set:

```javascript
petal.setDefaults({ headers: { 'Authorization': 'Bearer <YOUR_TOKEN>' } }) /* Update any of the default settings here */
```

When you set defaults for `body`, `headers`, and `params`, the previous defaults for those keys are completely replaced. However, the default `'Content-Type'` header remains as `'application/json'` unless you explicitly provide a new value.

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
      const petal = createPetal({ handleErrors: true, responseType: 'text' });

      async function flutter() {
        const portal = document.getElementById('fileInput');
        const filesToFlutter = Array.from(portal.files);

        const [ mischief, wondrousFind ] = await petal
          .flutterFiles('http://localhost:3000/flutter', filesToFlutter);

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

On the server side, we have crafted a whimsical Node.js script to embrace the fluttering files:

```javascript
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Create the magical upload directory if it doesn't exist
const mysticalDirectory = path.join(__dirname, 'library');
if (!fs.existsSync(mysticalDirectory)) {
  fs.mkdirSync(mysticalDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, mysticalDirectory);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, fileExtension);
    cb(null, fileName + '-' + Date.now() + fileExtension);
  },
});

const flutter = multer({ storage });

const app = express();
app.use(cors());

// A magical route to receive the fluttering files
app.post('/flutter', flutter.any(), async (req, res) => {
  console.log('Received fluttering files', req.files.map((file) => file.path));
  return res.send({ message: 'Files fluttered and enchanted successfully.' });
});

// Magical server setup
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
```

Please note that, for now, the enchantment of file uploads from a Node.js environment is not supported. Stay tuned for future magical updates!

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

Please note that all request methods return a Promise that resolves to an array of two elements: `[error, response]`. If the request is successful, `error` will be `null` and `response` will contain the server's response. If the request fails, `error` will contain the error and `response` will be `null`.

## Conclusion

With the PetalFetch library, making HTTP requests is as delightful as a walk through a blooming garden. Its easy-to-use API and flexible customization options make it a powerful tool for any JavaScript project. Try it out and let the magic of PetalFetch make your coding journey more enjoyable!

Happy coding!

### License

This project is licensed under the MIT License. Refer to the LICENSE file for more details.
