module.exports.generateBody = (fullName, email, mobileNo, query) => {
  const output = `
        <p>You have new contact request</p>
        <h3>Contact Details</h3>
        <ul>
            <li>FullName: ${fullName}</li>
            <li>Email: ${email}</li>
            <li>MobileNo: ${mobileNo}</li>
        </ul>
        <h3>Message</h3>
        ${query}
    `;
  return output;
};
