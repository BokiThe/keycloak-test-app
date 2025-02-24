# Keycloak test app

This app is created as a template to test keycloak login and register process using [VITE](https://vite.dev/) , [keycloak-js](https://www.npmjs.com/package/keycloak-js) , and react Context

## Installation

First install dependencies

```bash

npm i 

or

npm install

```

Then create .env file as for the .env.example is showing

```bash

VITE_APP_KEYCLOAK_URL=keycloak-url
VITE_APP_KEYCLOAK_CLIENT_ID=your-client
VITE_APP_KEYCLOAK_REALM=your-realm

```

## Usage

Make sure to setup the client to accept the http://localhost:5173* or http://localhost* as a redirect url on the keycloak console 

after that you can test and see how to connect with keycloak and what keycloak actions can you initiate from your app

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
