import jsSHA from 'jssha';

export const payUMoneyPayment = async (req, res) => {
  var pd = req.body;
  var hashString =
    process.env.PAYUMERCHANTKEY + // Merchant Key
    '|' +
    pd.txnid +
    '|' +
    pd.amount +
    '|' +
    pd.productinfo +
    '|' +
    pd.firstname +
    '|' +
    pd.email +
    '|' +
    '||||||||||' +
    process.env.PAYUSALT; // Your salt value
  var sha = new jsSHA('SHA-512', 'TEXT');
  sha.update(hashString);
  var hash = sha.getHash('HEX');
  sendResponse(res, 200, 'success', hash);
};

export const payUResponse = async (req, res) => {
  var pd = req.body;

  //Generate new Hash
  var hashString =
    process.env.PAYUSALT +
    '|' +
    pd.status +
    '||||||||||' +
    '|' +
    pd.email +
    '|' +
    pd.firstname +
    '|' +
    pd.productinfo +
    '|' +
    pd.amount +
    '|' +
    pd.txnid +
    '|' +
    process.env.PAYUMERCHANTKEY;
  var sha = new jsSHA('SHA-512', 'TEXT');
  sha.update(hashString);
  var hash = sha.getHash('HEX');
  // Verify the new hash with the hash value in response
  if (hash == pd.hash) {
    sendResponse(res, 200, 'success', pd.status);
  } else {
    sendResponse(res, 400, 'hash does not match');
  }
};
