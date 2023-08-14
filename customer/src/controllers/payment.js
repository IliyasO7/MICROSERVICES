import Payment from '../../../shared/models/payment.js';
import { sendResponse } from '../../../shared/utils/helper.js';

export const getPayuCheckout = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return sendResponse(res, 400, 'payment not found');

  res.send(`<body>
<form action='https://secure.payu.in/_payment' method='post'>
<input type="hidden" name="key" value="${process.env.PAYU_KEY}" />
<input type="hidden" name="txnid" value="${payment._id.toString()}" />
<input type="hidden" name="productinfo" value="${req.query.product}" />
<input type="hidden" name="amount" value="${payment.amount}" />
<input type="hidden" name="email" value="${req.query.email}" />
<input type="hidden" name="firstname" value="${req.query.name}" />
<input type="hidden" name="surl" value="${req.query.callbackUrl}" />
<input type="hidden" name="furl" value="${req.query.callbackUrl}" />
<input type="hidden" name="phone" value="${req.query.mobile}" />
<input type="hidden" name="hash" value="${req.query.hash}" />
<input style="display:none" id="submit" type="submit" value="submit"> </form>
<script>
document.getElementById("submit").click()
</script>
</body>
</html>`);
};
