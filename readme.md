# PetalFetch

Introducing PetalFetch, a snappy little JavaScript library! Think of it as a digital hummingbird that swiftly carries your HTTP requests to APIs in both browser and Node.js worlds, using the native tools of `fetch` and `https`. And with a bit of hummingbird magic, it brings back the responses as tidy JSON. Handy, isn't it?

# Installation

To get PetalFetch fluttering in your code, simply use npm:

```shell
npm install --save petalfetch
```


## Usage

To get started, invite the library into your JavaScript file:

```javascript
const createPetal = require('petalfetch');
```

## Spawning a Petal Instance

To whip up an instance of PetalFetch, use the createPetal function:

```javascript
const petal = createPetal();
```

And if you want every request to carry along some default headers and responseType, you can do so too:

```javascript
const petal = createPetal({
  baseurl: 'https://api.beesrus.com', // The hive of buzzing data
  method: 'GET', // Your go-to way of requesting data
  timeout: 5000, // Giving your bees 5 seconds to respond
  headers: {
    'Authorization': 'Bearer <YOUR_TOKEN>' // A secret passcode for accessing the hive
  },
  responseType: 'json', // Receiving the sweet response in JSON format
  handleErrors: true, // Requesting the library to kindly handle any errors
  params: {
    limit: 30, // Requesting a limit of 30 bees' worth of data
  },
  body: {
    uid: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' // A special identification for your bee request
  }
});
```
Now you can buzz through your code and retrieve buzzing data with ease. Just like a bee gracefully hovering from flower to flower, PetalFetch helps you flutter through the APIs, bringing back nectar-like responses.

## Slinging HTTP Requests

The petal instance is equipped with six nifty methods for making HTTP requests: `get`, `post`, `put`, `patch`, `delete`, and the all-rounder `request`.

**GET Request**

```javascript
const [misfortune, wondrousFind] = await petal.get(url, options);

if (!mischief) {
  console.log('Behold! A wondrous find awaits:', wondrousFind);
}
```

**POST Request**

```javascript
const [catastrophe, marvel] = await petal.post(url, options);

if (!catastrophe) {
  console.log('Magical transformation complete! Response:', marvel);
}
```

**PUT Request**

```javascript
const [glitch, magic] = await petal.put(url, options);

if (!glitch) {
  console.log('Abracadabra! Response:', magic);
}
```

**PATCH Request**

```javascript
const [mischief, wonder] = await petal.patch(url, options);

if (!misfortune) {
  console.log('Hocus Pocus! Response:', wonder);
}
```

**Delete Request**

```javascript
const [catastrophe, marvel] = await petal.delete(url, options);

if (!error) {
  console.log('Response:', response);
}
```

**General Request** You can employ `request` to make any HTTP requests with the petal instance. Just plug in the appropriate values for url and options for your case.

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

## Tweaking Defaults

With PetalFetch's `setDefaults()` method, you have the power to customize the default configuration for your HTTP requests even after initializing the library. Behold all the options you can tweak:

### baseurl

The `baseurl` option in PetalFetch lets you set a home base for your HTTP requests. It's like having a magical teleportation portal that transports your requests to the desired destination.

🏰 Setting the `baseurl` during initialization:

```javascript
const petal = createPetal({
  baseurl: 'http://enchanted-forest.com', // The mystical Enchanted Forest
});
```

Now, a request like `petal.get('/magical-creature')` will automatically target 'http://enchanted-forest.com/magical-creature'.

🧙 Overriding the `baseurl` for a specific request:

```javascript
const response = await petal.get(`/secret-cave`, { baseurl: `http://hidden-kingdom.com` }); // A detour to the hidden realm of the Secret Cave
```

This request will target 'http://hidden-kingdom.com/secret-cave' instead of the `baseurl` set during the creation of the PetalFetch instance.

🌌 Updating the `baseurl` at any time:

```javascript
petal.setDefaults({ baseurl: 'http://new-kingdom.com' }) // Embarking on a grand adventure to the New Kingdom
```

🔮 Unleashing the power of unset:

```javascript
petal.setDefaults({ baseurl: null }) // Vanishing into the URL-less void, wandering through magical realms without a home base
```

⚡ Intelligent URL Concatenation: The `baseurl` option ensures smooth travel by handling URL concatenation intelligently. It avoids double slashes (`//`) when the `baseurl` ends with a slash and the URL begins with one. Likewise, if there's a missing slash between the `baseurl` and the URL, PetalFetch magically inserts it, maintaining URL correctness and preventing pesky bugs.

### method

The `method` option allows you to declare your go-to HTTP method, like a trusted wand in your spellcasting repertoire.

🪄 Setting the default method:

```javascript
petal.setDefaults({ method: 'POST' }) // Unleashing the power of the POST spell
```

Remember, if a specific request doesn't indicate a method, this default method will be summoned. But fear not! You can always override it by supplying the `method` option in that request.

### timeout

The `timeout` option lets you control the duration of your magical requests, giving them a finite timeframe.

⏰ Setting the default timeout:

```javascript
petal.setDefaults({ timeout: 5000 }) // Empowering your requests with a time limit (5 seconds)
```

If a request doesn't specify a timeout, this default will be your trusty companion. However, you can always override it by supplying the `timeout` option in a specific request.

### headers

The `headers` option allows you to equip your requests with mystical headers that carry secret spells and incantations.

🎩 Setting default headers:

```javascript
petal.setDefaults({ headers: { 'Authorization': 'Bearer <YOUR_TOKEN>' } }) // Unlocking the secrets with your token
```

If a request doesn't specify headers, these defaults will accompany your magical requests. But remember, when both default headers and request-specific headers are present, the latter takes precedence. The default `'Content-Type'` is `'application/json'`, but it can be overridden by explicitly providing a new `'Content-Type'` header in a specific request.

### responseType

The `responseType` option lets you choose the form in which the magical responses are delivered to you.

📜 Setting the default response format:

```javascript
petal.setDefaults({ responseType: 'text' }) // Unfolding the responses in mesmerizing text form
```

If a request doesn't specify a `responseType`, the default format will be used. You can override this for any request by supplying the `responseType` option in that request.

### handleErrors with PetalFetch

The `handleErrors` option brings a touch of seriousness to our whimsical adventure. When set to `true`, PetalFetch will return errors instead of throwing them, allowing you to handle them with precision and care.

Here's an example of using `handleErrors`:

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

In the above example, when `handleErrors` is set to `true`, PetalFetch will resolve the Promise even if an error occurs during the request. The first element in the result array will be `spellGoneWrong`, which represents the error, while the second element `wondrousResponse` holds the response when the request succeeds.

If you decide to disable `handleErrors` for a specific request by setting it to `false`, any error encountered during that request will be thrown as an exception, which you can gracefully catch using `try/catch`.

This `handleErrors` option provides flexibility in how you handle errors throughout your magical coding journey. You can choose to embrace errors and handle them individually or let them gracefully flow through your code, ready to be captured when needed. The choice is yours!

### params

The `params` option allows you to sprinkle enchanting query parameters into your requests, unlocking hidden realms and treasures.

🌟 Setting default query parameters:

```javascript
petal.setDefaults({ params: { limit: 30, sort: 'asc' } }) // Sprinkling your requests with the power of limit and sort
```

These parameters will accompany every request made by the PetalFetch instance. If a request doesn't specify query parameters, these defaults will be used. You can override or extend them in any specific request by providing the `params` option.

### body

The `body` option lets you infuse default content into the body of every request, like a magical essence that empowers your intentions.

📦 Setting default request body content:

```javascript
petal.setDefaults({ body: { uid: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed' } }) // Infusing your requests with a unique identifier
```

If a request doesn't specify body content, this default will be used. You can always override it by supplying the `body` option in a specific request.

Each of these options provides a layer of customization for your HTTP requests. By setting them when creating the PetalFetch instance or modifying them with the `setDefaults` method, you can embark on a magical coding journey filled with wonder and whimsy. Now, go forth and cast your HTTP spells with PetalFetch! May your requests always be enchanting, and your code be full of delight! ✨🌸✨

## Tailoring Request Options

Every request method in PetalFetch comes with an options parameter that allows you to customize the request in a delightful way.

### Query Parameters

To include some whimsical query parameters, simply provide a `params` property in the options object:

```javascript
const options = {
  baseurl: "https://sevenhalls.com",
  params: {
    limit: 30,
    magicLevel: "Third"
  }
};

petal.get("/books", options); // https://sevenhalls.com/books?limit=30&magicLevel=Third
```

Unleash your imagination and let the query parameters add a touch of enchantment to your requests.

### Request Body

For POST and PUT requests, you have the power to provide a captivating request body by adding a `body` property in the options object:

```javascript
const options = {
  body: {
    id: '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
    name: 'Magical potion',
    ingredients: ['unicorn tears', 'dragon scales'],
    createdDate: 1688569673780,
  },
};

petal.post(url, options);
```

Cast a spell on your server by crafting a spellbinding request body that contains all the ingredients of your enchanting creation.

### Response Type

You can specify the desired response type to receive a response that resonates with your wizardry. Add a `responseType` property in the options object with one of the following magical values:

- `"json"` (default): The response is parsed as JSON, revealing its mystical secrets.
- `"text"`: The response is retrieved as plain text, allowing you to decipher its hidden messages.
- `"blob"`: The response is retrieved as a Blob, like a mysterious magical artifact waiting to be explored.

For example, to unveil the JSON secrets, use the following incantation:

```javascript
const options = {
  responseType: 'json',
};

const [error, magic] = await petal.get(url, options);

if (!error) {
  console.log('Magic Unveiled:', magic);
}
```

Prepare to be dazzled as the response reveals its true nature in the format of your choice.

### Custom Headers

If you wish to include custom headers, prepare your magical arsenal by adding a `headers` property in the options object:

```javascript
const options = {
  headers: {
    'Content-Type': 'text/html',
    'Authorization': 'Bearer <YOUR_TOKEN>',
    'Spell': 'Wingardium Leviosa',
  },
};

petal.get(url, options);
```

Empower your request with mystical headers that carry the essence of your magic. Whether it's authentication tokens or enchanting spells, these headers will guide your request on a marvelous journey.

Let your imagination soar as you tailor the request options to create a truly enchanting experience with PetalFetch.

## File Upload

The library supports a whimsical feature called "Fluttering Files" that allows you to upload files in a magical way. The `flutterFiles` function gracefully sends a POST request to the server, carrying multiple files within the body of the request, all in the form of `multipart/form-data`.

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

### License

This project is licensed under the MIT License. Refer to the LICENSE file for more details.
