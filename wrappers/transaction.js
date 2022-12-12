const moment = require("moment");
const connection = require("../utilities/connection");
const constants = require("../utilities/constants");

const Service = require("../models/Service.model");
const User = require("../models/User.model");
const Transaction = require("../models/Transaction.model");

const userWrapper = require("./user");
const serviceWrapper = require("./service");
const notificationWrapper = require("./notification");

const notificationService = require("../services/notification");

const createTransaction = async (payload) => {
  const transaction = await connection.transaction();

  try {
    const message = constants.GENERAL_FUNCTIONS.FORMAT_REQUIRED_FIELDS(
      ["amount"],
      payload
    );
    if (message.length > 0)
      throw new Error(`${message.join(", ")} missing from the request`);

    const serviceResponse = await serviceWrapper.createService(
      {
        service: payload.service,
        operator: payload.operator,
        package: payload.package,
        contact: payload.contact,
        meter_number: payload.meter_number,
        payment_code: payload.payment_code,
        bloom_pay_id: payload.bloom_pay_id,
        promotion: payload.promotion,
        name: payload.name,
        email: payload.email,
        bank: payload.bank,
        iban: payload.iban,
      },
      transaction
    );
    if (!serviceResponse.status) throw new Error(serviceResponse.message);

    payload.amount = parseFloat(payload.amount);
    payload.total =
      (parseFloat(payload.amount) * parseFloat(payload.promotion || 0)) / 100;
    payload.body = JSON.stringify(payload.body);
    payload.response = JSON.stringify(payload.response);
    payload.created_at = moment().format("YYYY-MM-DD HH:mm");
    payload.updated_at = moment().format("YYYY-MM-DD HH:mm");
    payload.user_id = payload.user_id;
    payload.service_id = serviceResponse.service.id;

    await userWrapper.creditBalance(
      {
        user_id: payload.user_id,
        balance: payload.amount,
      },
      transaction
    );

    let userResponse = await userWrapper.getToken(payload.user_id);
    if (!userResponse.status)
      userResponse = {
        web_token: null,
        mobile_token: null,
      };

    const webToken = userResponse.web_token;
    const mobileToken = userResponse.mobile_token;

    if (webToken)
      await notificationService.send({
        to: webToken,
        notification: {
          title: payload.service,
          body: `${payload.service}, ${payload.operator} you bought this`,
        },
      });

    if (mobileToken)
      await notificationService.send({
        to: mobileToken,
        notification: {
          title: payload.service,
          body: `${payload.service}, ${payload.operator} you bought this`,
        },
      });

    await notificationWrapper.createNotification({
      title: payload.service,
      description: `${payload.service}, ${payload.operator}`,
      seen: false,
      user_id: payload.user_id,
    });

    let response = await Transaction.create(payload, { transaction });

    transaction.commit();

    return {
      status: true,
      transaction: response,
    };
  } catch (error) {
    transaction.rollback();

    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const updateTransaction = async (payload) => {
  try {
    if (!payload.id) throw new Error("id missing from the request");

    let response = await Transaction.findOne({
      where: { id: payload.id },
    });

    if (!response) throw new Error("transaction not found");

    if (payload.month) response.month = payload.month;
    if (payload.year) response.year = payload.year;
    if (payload.name) response.name = payload.name;
    if (payload.number && payload.number !== response.number)
      response.number = await constants.GENERAL_FUNCTIONS.ENCRYPT_PASSWORD(
        payload.number
      );
    if (payload.cvc && payload.cvc !== response.cvc)
      response.cvc = await constants.GENERAL_FUNCTIONS.ENCRYPT_PASSWORD(
        payload.cvc
      );

    response.updated_at = moment().format("YYYY-MM-DD HH:mm");

    response = await response.save();

    return {
      status: true,
      transaction: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const deleteTransaction = async (id) => {
  try {
    if (!id) throw new Error("id missing from the request");

    let response = await Transaction.destroy({
      where: { id },
    });

    return {
      status: true,
      transaction: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getParams = (params) => {
  const where = {};

  if (params.id) where.id = params.id;

  return where;
};

const getTransactions = async (params) => {
  try {
    let response = await Transaction.findAndCountAll({
      include: [
        {
          model: Service,
          as: "service",
        },
        {
          model: User,
          as: "user",
        },
      ],
      where: getParams(params),
    });

    return {
      status: true,
      count: response.count,
      transactions: response.rows,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getTransaction = async (id) => {
  try {
    let response = await Transaction.findOne({
      include: [
        {
          model: Service,
          as: "service",
        },
        {
          model: User,
          as: "user",
        },
      ],
      where: { id },
    });

    if (!response) throw new Error("transaction not found");

    return {
      status: true,
      transaction: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const getTransactionByUSer = async (user_id) => {
  try {
    let response = await Transaction.findAll({
      include: [
        {
          model: Service,
          as: "service",
        },
        {
          model: User,
          as: "user",
        },
      ],
      where: { user_id },
    });

    if (!response) throw new Error("transaction not found");

    return {
      status: true,
      transactions: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const transfer = async (user_id, payload) => {
  const transaction = await connection.transaction();

  try {
    let debtorUserResponse = {
      status: false,
      message: "no user found",
    };

    if (payload.contact)
      debtorUserResponse = await userWrapper.getUserByContact(
        payload.contact,
        transaction
      );
    if (payload.id_number)
      debtorUserResponse = await userWrapper.getUserByIDNumber(
        payload.id_number,
        transaction
      );
    if (!debtorUserResponse.status) throw new Error(debtorUserResponse.message);

    let creditorUserResponse = await userWrapper.getUser(user_id)
    if (!creditorUserResponse.status) throw new Error(creditorUserResponse.message);
    if (parseFloat(creditorUserResponse.user.balance) <= 0) throw new Error('Insufficient balance');
    if (parseFloat(creditorUserResponse.user.balance) <= parseFloat(payload.amount)) throw new Error('Insufficient balance');

    await userWrapper.creditBalance({
      user_id: user_id,
      balance: payload.amount,
    });

    await userWrapper.debitBalance({
      user_id: debtorUserResponse.user.id,
      balance: payload.amount,
    });
    
    const creditorResponse = await serviceWrapper.createService(
      {
        service: "Transfer",
        operator: "Bloompay",
        name: debtorUserResponse.name,
        contact: debtorUserResponse.contact,
        bank: "Bloompay",
        iban: debtorUserResponse.id_number,
      },
      transaction
    );
    if (!creditorResponse.status) throw new Error(creditorResponse.message);
    const debtorResponse = await serviceWrapper.createService(
      {
        service: "Add Cash",
        operator: "Bloompay",
        name: creditorUserResponse.name,
        contact: creditorUserResponse.contact,
        bank: "Bloompay",
        iban: creditorUserResponse.id_number,
      },
      transaction
    );
    if (!debtorResponse.status) throw new Error(debtorResponse.message);

    const transactionPayload = [
      {
        user_id: user_id,
        service_id: creditorResponse.service.id,
        amount: parseFloat(payload.amount),
        total: parseFloat(payload.amount),
        body: JSON.stringify(payload),
        created_at: moment().format("YYYY-MM-DD HH:mm"),
        updated_at: moment().format("YYYY-MM-DD HH:mm"),
        response: null,
        status: "Completed",
      },
      {
        user_id: debtorUserResponse.user.id,
        service_id: debtorResponse.service.id,
        amount: parseFloat(payload.amount),
        total: parseFloat(payload.amount),
        body: JSON.stringify(payload),
        created_at: moment().format("YYYY-MM-DD HH:mm"),
        updated_at: moment().format("YYYY-MM-DD HH:mm"),
        response: null,
        status: "Completed",
      },
    ];

    let response = await Transaction.bulkCreate(transactionPayload, {
      transaction,
    });

    transaction.commit();

    return {
      status: true,
      message: "Transaction has been made successfully",
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

const hook = async (payload) => {
  const transaction = await connection.transaction();

  try {
    const userResponse = await userWrapper.getUserByIDNumber(
      payload.eventData.destinationAccountInformation.accountNumber,
      transaction
    );

    if (!userResponse.status) throw new Error(userResponse.message);

    const serviceResponse = await serviceWrapper.createService(
      {
        service: "Add Cash",
        operator: "Debit",
        contact: payload.eventData.product.reference,
        name: payload.eventData.customer.name,
        email: payload.eventData.customer.email,
        bank: payload.eventData.destinationAccountInformation.bankName,
        iban: payload.eventData.destinationAccountInformation.accountNumber,
      },
      transaction
    );
    if (!serviceResponse.status) throw new Error(serviceResponse.message);

    const transactionPayload = {
      user_id: userResponse.user.id,
      service_id: serviceResponse.service.id,
      amount: parseFloat(payload.eventData.amountPaid),
      total: parseFloat(payload.eventData.amountPaid),
      created_at: moment().format("YYYY-MM-DD HH:mm"),
      updated_at: moment().format("YYYY-MM-DD HH:mm"),
      body: JSON.stringify(payload),
      response: JSON.stringify(payload),
      status: payload.eventData.paymentStatus,
    };

    let response = await Transaction.create(transactionPayload, {
      transaction,
    });
    await userWrapper.debitBalance({
      user_id: userResponse.user.id,
      balance: payload.eventData.amountPaid,
    });

    transaction.commit();

    return {
      status: true,
      transaction: response,
    };
  } catch (error) {
    return {
      status: false,
      message: constants.GENERAL_FUNCTIONS.FORMAT_ERROR(error),
    };
  }
};

module.exports = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getTransaction,
  getTransactionByUSer,
  transfer,
  hook,
};
