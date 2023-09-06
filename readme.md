# Self-serve credential issuance API

This is a node.js + express server which enables issuance of credentials.
These credentials are issued by a key which you set via a env variable.

## How it works

After setting up, send a `POST` request to `https://YOUR_URL/api/create` with the correct body parameters, and receive a signed credential associated with the DID:PKH method.

```ts
type RequestBody = {
  credSubject: {
    id: string, // Always Required. Include the did: method e.g. did:ethr:0x1234...
    [key: string]: any // All other parameters for the given schema
  };
  recipient: string; // The recipient ID including did method, e.g. did:ethr:0x1234...
  schema: JSONSchema7; // The full JSON schema file
};

const requestBody: RequestBody = {
    credSubject: {
      // Always include the recipient ID
      id: `did:ethr:${RECIPIENT}`,
            // Incldue your other propertiies
      foo: 'bar',
    },
    recipient: `did:ethr:${RECIPIENT}`,
    schema: schema,
  }

const endpoint = `${YOUR_ENDPOINT}/api/create`

const result = await fetch(endpoint, {
  method: "POST",
  mode: "cors", // this cannot be 'no-cors'
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify(requestBody),
});

const issue = await result.json();

// Returns VC or error
console.log(issue);
```

## ⚙️ `.env`

The `.env` file requires the following:
```
PKEY=YOUR_PRIVATE_KEY
PORT=7001
```

## Example set up process with heroku:
1. Create an account with heroku
2. Install heroku: `brew tap heroku/brew && brew install heroku`
3. log in: `heroku login`
4. clone repo:  `git clone https://github.com/discoxyz/self-serve-signing-example.git`
5. push to heroku: `git push heroku main`
6. Set your vars:
  - `heroku config:set PKEY=YOUR_PRIVATE_KEY`
  - `heroku config:set PORT=7001`
7. Grab the URL from heroku and add `/api/create`. That's the endpoint.

## ⚠️ Considerations

- The API is not gated in any way. Consider adding authentication depending on your use case, to ensure that your issued credentials are not polluted
- Only `did:pkh` is supported. Using `did:ethr` would only involve changing the `did:pkh:eip-155:1` strings to `did:ethr`
