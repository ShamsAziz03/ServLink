const PaymentModel = require("../models/paymentModel");
const Stripe = require("stripe");

const SECRET_KEY = process.env.SECRET_KEY;
const stripe = Stripe(SECRET_KEY);

exports.getOrCreateCustomer = async (req, res) => {
  try {
    //check first if user has customer obj in db and stripe then return
    const { user } = req.body;
    const result = await PaymentModel.getUserWallet(user.user_id);
    if (result.length !== 0 && result[0].stripe_customer_id) {
      return res.json({
        customer: result[0],
      });
    }
    //else then create new obj
    const customer = await stripe.customers.create({
      email: user.email,
    });
    // Store in database
    await PaymentModel.createWallet(user.user_id, customer.id);

    res.json({ customer: customer });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user wallet or create customer obj in stripe",
      error: err.message,
    });
  }
};

exports.createSetupIntent = async (req, res) => {
  try {
    const { customerId } = req.body;

    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
    });

    res.json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create SetupIntent",
      error: err.message,
    });
  }
};

exports.updatePaymentMethodByCustomer = async (req, res) => {
  try {
    const { customerId, paymentMethodId } = req.body;

    if (!customerId || !paymentMethodId) {
      return res.status(400).json({
        message: "Customer ID and Payment Method ID are required",
      });
    }

    await PaymentModel.updatePaymentMethodByCustomerId(
      customerId,
      paymentMethodId
    );

    res.json({
      success: true,
      message: "Payment method updated successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update payment method",
      error: err.message,
    });
  }
};

exports.getUserWallet = async (req, res) => {
  try {
    const user_id = req.query.userId;
    const result = await PaymentModel.getUserWallet(user_id);
    if (result.length !== 0 && result[0].stripe_customer_id) {
      return res.json({
        userWallet: result[0],
      });
    } else {
      return res.json({
        error: "Can't find this user",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user wallet",
      error: err.message,
    });
  }
};

exports.paymentIntent = async (req, res) => {
  try {
    const { customerId, paymentMethodId, amount } = req.body;

    const setupIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true,
      confirm: true,
    });

    res.json({
      status: setupIntent.status,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to payment",
      error: err.message,
    });
  }
};

exports.updateAmongWallet = async (req, res) => {
  try {
    const {user_id,among} = req.body;
    const result = await PaymentModel.updateAmongWallet(user_id,among);
    return res.json(result);
  } catch (err) {
    res.status(500).json({
      message: "Error updating among user wallet",
      error: err.message,
    });
  }
};
