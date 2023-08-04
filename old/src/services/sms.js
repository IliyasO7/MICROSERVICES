const axios = require("axios");
const qs = require("qs");
const _ = require("lodash");

// Send SMS
exports.send = async (data) => {
  try {
    // Data: phone, senderId, message, type

    await axios({
      method: "POST",
      url: `https://api.kaleyra.io/v1/${process.env.KALEYRA_SID}/messages`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "api-key": process.env.KALEYRA_API_KEY,
      },
      data: qs.stringify({
        to: data.phone,
        type: data.type || "OTP",
        sender: data.senderId,
        body: data.message,
        template_id: data.templateId,
      }),
    });

    return true;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
