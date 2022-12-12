const bcrypt = require("bcrypt");

const FORMAT_RESPONSE_FIELD = (message) =>
  message.replace("The ", "").replace(" field is required.", "");
const FORMAT_RESPONSE_FIELDS = (requiredFields) => {
  let fields = [];

  for (let i = 0; i < requiredFields.length; i++)
    fields.push(FORMAT_RESPONSE_FIELD(requiredFields[i]));

  return fields;
};

module.exports = {
  // DEVELOPMENT: {
  //   USERNAME: 'prime_root_user',
  //   PASSWORD: 'prime_root_user',
  //   DATABASE: 'prime_crypto',
  //   HOST: '184.168.101.66',
  //   PORT: 3306,
  // },
  DEVELOPMENT: {
    USERNAME: "root",
    PASSWORD: "",
    DATABASE: "prime_crypto",
    HOST: "localhost",
    PORT: 8889,
  },
  PRODUCTION: {
    USERNAME: "",
    PASSWORD: "94CihjVW",
    DATABASE: "",
    HOST: "mysql--0.cloudclusters.net",
    PORT: "18851",
  },
  MONIFY: {
    BASE_URL: "https://sandbox.monnify.com/api",
    AUTHORIZATION: "Basic ",
    CONTRACT_CODE: "",
  },
  SHAGO: {
    BASE_URL: "http://test.shagopayments.com/public/api/test/b2b",
    HASH_KEY: "",
    DOCUMENT_NUMBERS: {
      BANK: "-BT-",
    },
  },
  BANK: {
    BASE_URL: "",
  },
  KEYS: {
    AUTHORIZATION_KEY: "AAAAH_OeRZQ:",
  },
  GENERAL_FUNCTIONS: {
    GET_TOKEN: () => {
      const token = [];
      const possibilities = "";

      for (let i = 0; i < 64; i++)
        token[i] = possibilities.charAt(
          Math.floor(Math.random() * possibilities.length)
        );

      return token.join("");
    },
    TO_ARRAY: (string) => string.split(","),
    ENCRYPT_PASSWORD: async (password) => await bcrypt.hash(password, 10),
    COMPARE_PASSWORD: async (password, hash) =>
      await bcrypt.compare(password, hash),
    FORMAT_REQUIRED_FIELDS: (requiredFields, payload) => {
      const message = [];

      for (let field in requiredFields)
        if (!payload[requiredFields[field]])
          message.push(requiredFields[field]);

      return message;
    },
    FORMAT_BULK_REQUIRED_FIELDS: (requiredFields, payload) => {
      const message = [];

      for (let i = 0; i < payload.length; i++)
        for (let field in requiredFields)
          if (!payload[i][requiredFields[field]])
            message.push(requiredFields[field]);

      return [...new Set(message)];
    },
    FORMAT_ERROR: (error) => {
      let message = error.message;

      if (error.errors && error.errors.length > 0) {
        let errors = [];

        for (let i = 0; i < error.errors.length; i++)
          errors.push(error.errors[i].message);

        message = errors.join(", ");
      }

      if (message.indexOf("foreign key") > -1)
        message = "cannot delete due to foreign key";

      return message;
    },
    FORMAT_SHAGO_ERROR: (response) => {
      switch (response.status) {
        case "301":
          return `${FORMAT_RESPONSE_FIELDS(response.required_fields).join(
            ", "
          )} missing from the request`;
        case "310":
          return response.message;
        case "AUTH002":
          return response.message;

        default:
          return response.message;
      }
    },
    FORMAT_MONNIFY_ERROR: ({ response }) => {
      if (response?.data.responseCode)
        switch (response?.data.responseCode) {
          case "99":
            return response?.data.responseMessage;

          default:
            return response?.data.responseMessage;
        }
      else
        switch (response?.data.status) {
          case "404":
            return response?.data.message;

          default:
            return response?.data.message;
        }
    },
  },
};
