const {
  WebpayPlus,
  Options,
  IntegrationCommerceCodes,
  IntegrationApiKeys,
  Environment,
} = require('transbank-sdk');
const Order = require('../models/Order');

// Configuración para pruebas (modo integración)
const options = new Options(
  IntegrationCommerceCodes.WEBPAY_PLUS, // Código de comercio de integración
  IntegrationApiKeys.WEBPAY,            // API Key de integración
  Environment.Integration               // Ambiente de integración
);

// Instancia de transacción
const tx = new WebpayPlus.Transaction(options);

// Iniciar transacción
exports.initTransaction = async (req, res) => {
  try {
    let { amount, orderId } = req.body;

    if (!amount || !orderId)
      return res.status(400).json({ msg: "amount y orderId son requeridos" });

    // Asegurar que amount sea entero sin decimales para Webpay (pesos chilenos)
    // Si amount viene con decimales (ej: "1500.00"), se convierte a entero
    amount = Math.floor(Number(amount));

    const response = await tx.create(
      orderId.toString(),
      "sessionId123",
      amount,
      process.env.TBK_RETURN_URL || 'http://localhost:3000/success'
    );

    return res.json({
      url: response.url,
      token: response.token
    });

  } catch (error) {
    console.error("Error creando transacción Webpay:", error);
    return res.status(500).json({ msg: "Error iniciando transacción" });
  }
};

// Confirmar transacción (cuando Webpay retorna)
exports.commitTransaction = async (req, res) => {
  try {
    const token = req.body.token_ws;

    if (!token)
      return res.status(400).json({ msg: "token_ws faltante" });

    const response = await tx.commit(token);

    // Si el pago fue autorizado, actualizamos orden
    if (response.status === "AUTHORIZED") {
      await Order.findByIdAndUpdate(response.buy_order, {
        paymentStatus: "paid"
      });
    }

    return res.json(response);

  } catch (error) {
    console.error("Error confirmando Webpay:", error);
    return res.status(500).json({ msg: "Error confirmando transacción" });
  }
};
