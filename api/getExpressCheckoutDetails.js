const https = require("https");
const querystring = require("querystring");

const PAYPAL_API_USERNAME = "your_sandbox_api_username";
const PAYPAL_API_PASSWORD = "your_sandbox_api_password";
const PAYPAL_API_SIGNATURE = "your_sandbox_api_signature";

module.exports = async (req, res) => {
  const { token } = req.query;

  const params = querystring.stringify({
    METHOD: "GetExpressCheckoutDetails",
    USER: PAYPAL_API_USERNAME,
    PWD: PAYPAL_API_PASSWORD,
    SIGNATURE: PAYPAL_API_SIGNATURE,
    VERSION: "204",
    TOKEN: token,
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
        res.redirect(
          `https://nvpsoaptest3.vercel.app/api/doExpressCheckout?token=${response.TOKEN}&PayerID=${response.PAYERID}`
        );
      } else {
        res.status(500).json({ error: "Failed to get details", response });
      }
    });
  });

  paypalReq.on("error", (error) => {
    res.status(500).json({ error: error.message });
  });

  paypalReq.write(params);
  paypalReq.end();
};