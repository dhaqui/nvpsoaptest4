const https = require("https");
const querystring = require("querystring");

const PAYPAL_API_USERNAME = "testpp5678_api1.gmail.com";
const PAYPAL_API_PASSWORD = "VB6XFM4ECSJJWC3Z";
const PAYPAL_API_SIGNATURE = "AtrtuiK97tX1CiU8WNBpJkGLm2U9A8PbX9onAIILKx-eushGlrAM2BIF";

module.exports = async (req, res) => {
  const params = querystring.stringify({
    METHOD: "SetExpressCheckout",
    USER: PAYPAL_API_USERNAME,
    PWD: PAYPAL_API_PASSWORD,
    SIGNATURE: PAYPAL_API_SIGNATURE,
    VERSION: "204",
    RETURNURL: "https://nvpsoaptest4.vercel.app/api/getExpressCheckoutDetails",
    CANCELURL: "https://nvpsoaptest4.vercel.app/public/cancel.html",
    PAYMENTREQUEST_0_AMT: "10.00",
    PAYMENTREQUEST_0_CURRENCYCODE: "USD",
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
        const redirectUrl = `https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=${response.TOKEN}`;
        res.redirect(redirectUrl);
      } else {
        res.status(500).json({ error: "Failed to set express checkout", response });
      }
    });
  });

  paypalReq.on("error", (error) => {
    res.status(500).json({ error: error.message });
  });

  paypalReq.write(params);
  paypalReq.end();
};
