import pkg from 'transbank-sdk';
const { WebpayPlus, Options, IntegrationApiKeys, Environment } = pkg;

export const initTransaction = async (req, res) => {
  try {
    const buyOrder = 'order-' + Date.now();
    const sessionId = 'session-' + Date.now();
    const amount = 1000;
    const returnUrl = 'http://localhost:3000/api/payment/commit';

    const tx = new WebpayPlus.Transaction(
      new Options(IntegrationApiKeys.WEBPAY, Environment.Integration)
    );

    const response = await tx.create(buyOrder, sessionId, amount, returnUrl);

    res.json({
      url: response.url,
      token: response.token,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const commitTransaction = async (req, res) => {
  try {
    const { token_ws } = req.body;

    const tx = new WebpayPlus.Transaction(
      new Options(IntegrationApiKeys.WEBPAY, Environment.Integration)
    );

    const response = await tx.commit(token_ws);

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
