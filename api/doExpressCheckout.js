const https = require("https");
const querystring = require("querystring");

const PAYPAL_API_USERNAME = "sb-udb47t6004981_api1.business.example.com";
const PAYPAL_API_PASSWORD = "95T7GBBCN88PGWSB";
const PAYPAL_API_SIGNATURE = "ASh-K6JeEs4sPfbrjYWPsVqatt-UAlV0oguAd1d1Hyouvdbuib3X7RI8";
/**
const PAYPAL_API_USERNAME = "testpp5678_api1.gmail.com";
const PAYPAL_API_PASSWORD = "VB6XFM4ECSJJWC3Z";
const PAYPAL_API_SIGNATURE = "AtrtuiK97tX1CiU8WNBpJkGLm2U9A8PbX9onAIILKx-eushGlrAM2BIF";
*/


module.exports = async (req, res) => {
  const { token, PayerID } = req.query;

  const params = querystring.stringify({
    METHOD: "DoExpressCheckoutPayment",
    USER: PAYPAL_API_USERNAME,
    PWD: PAYPAL_API_PASSWORD,
    SIGNATURE: PAYPAL_API_SIGNATURE,
    VERSION: "204",
    TOKEN: token,
    PAYERID: PayerID,
    PAYMENTREQUEST_0_AMT: "10.00",
    PAYMENTREQUEST_0_CURRENCYCODE: "GHS",
    PAYMENTREQUEST_0_PAYMENTACTION: "Order",
  });

  const options = {
    hostname: "api-3t.sandbox.paypal.com",
    path: "/nvp",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": params.length,
    },
  };

  const paypalReq = https.request(options, (paypalRes) => {
    let data = "";
    paypalRes.on("data", (chunk) => {
      data += chunk;
    });

    paypalRes.on("end", () => {
      const response = querystring.parse(data);
      if (response.ACK === "Success") {
        res.json({ message: "Order successfully created", response });
      } else {
        res.status(500).json({ error: "Failed to create order", response });
      }
    });
  });

  paypalReq.on("error", (error) => {
    res.status(500).json({ error: error.message });
  });

  paypalReq.write(params);
  paypalReq.end();
};
