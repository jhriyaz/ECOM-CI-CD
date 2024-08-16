//dev,staging,vc
let environment = 'staging'


const swaggerAutogen = require('swagger-autogen')();
const outputFile = environment === 'dev'? './swagger_output.json':`./swagger_output_${environment}.json`;
const router = require('./server')
const endpointsFiles = ['./server']; // root file where the route starts.

const doc = {
  info: {
    title: 'TS4U Ecommerce API',
    description: 'Documentation of ecommerce api',
  },
  host: environment === 'dev'? 'localhost:5000':
  environment === 'staging'?"staging-be-ecom.techserve4u.com":
  environment === 'vc'?"vc-be.techserve4u.com":"",
  schemes: environment === 'dev'? ['http']:['https'],
  tags: [
    {
      "name": "User",
      "description": "Endpoints"
    },
    {
      "name": "Product",
      "description": "Endpoints"
    },
    {
      "name": "Order",
      "description": "Endpoints"
    },
    {
      "name": "Category",
      "description": "Endpoints"
    },
    {
      "name": "Campaign",
      "description": "Endpoints"
    },
    {
      "name": "Brand",
      "description": "Endpoints"
    },
    {
      "name": "Review",
      "description": "Endpoints"
    },
    {
      "name": "Address",
      "description": "Endpoints"
    },
    {
      "name": "Notification",
      "description": "Endpoints"
    }
  ],
  securityDefinitions: {
    Bearer: {
        type: "apiKey",
        in: "header", // can be "header", "query" or "cookie"
        name: "Authorization", // name of the header, query parameter or cookie
        description:
            "Please enter a valid token to test the requests below...",
    },

  },
  security: [{ "Bearer": [] }],
};




swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require('./server.js');           // Your project's root file
})