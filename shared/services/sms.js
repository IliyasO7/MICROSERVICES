import axios from "axios";
import qs from "qs";
import "lodash";

// Send SMS
export const send = async (data) => {
  try {
    // Data: phone, senderId, message, type

    const response = await axios({
      method: "POST",
      url: `https://api.kaleyra.io/v1/${process.env.KALEYRA_SID}/messages`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "api-key": process.env.KALEYRA_API_KEY,
      },
      data: qs.stringify({
        to: data.mobile,
        type: data.type || "OTP",
        sender: data.senderId,
        body: data.message,
        template_id: data.templateId,
      }),
    });

    return [response, null];
  } catch (err) {
    console.log(err.message);
    return [null, err];
  }
};
