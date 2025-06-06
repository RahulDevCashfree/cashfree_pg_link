const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs"); // To handle file operations

// Environment Configuration (Change 'Test' to 'Prod' as needed)
const environment = "Test"; // Use 'Test' or 'Prod'

// Dynamic Cashfree Credentials Based on Environment
const Cashfree = {
  XClientId:
    environment === "Test"
      ? "{{Test_client_id}}" // Test Client ID
      : "{{production_client_id}}", // Production Client ID
  XClientSecret:
    environment === "Test"
      ? "{{Test_client_secret}}" // Test Client Secret
      : "{{Production_client_secret}}", // Production Client Secret
  XEnvironment: environment,
};

// Base URL Based on Environment
const baseURL =
  Cashfree.XEnvironment === "Prod"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

// Generate a Unique Link ID
const linkID = `link_${uuidv4().replace(/-/g, "")}`;

// Calculate Expiry Time (15 days from now)
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 15);
const linkExpiryTime = expiryDate.toISOString();

// Payment Link Request Payload
const request = {
  link_amount: 1,
  link_currency: "INR",
  link_minimum_partial_amount: 0.0,
  link_id: linkID,
  link_partial_payments: false,
  customer_details: {
    customer_name: "John Doe",
    customer_phone: "8971520311",
    customer_email: "r.rahul@cashfree.com",
  },
  link_expiry_time: linkExpiryTime, // Dynamic expiry time
  link_purpose: "TVS Credit Loan Recovery Amount",
  link_notify: {
    send_sms: true,
    send_email: true,
  },
  link_auto_reminders: false,
  link_notes: {
    Loan_Account: "123456790",
    Loan_Type: "Personal_Loan",
  },
  link_meta: {
    notify_url: "https://webhook.site/a1e0ac66-76f8-4212-b277-196fc187fe6b",
    upi_intent: true,
    return_url: "https://b8af79f41056.eu.ngrok.io",
  },
};

// Function to Write Link ID to a JSON File
const writeLinkIdToFile = (linkId) => {
  const filePath = "link_data.json"; // File to store the link ID
  const data = { link_id: linkId }; // Object to write to the file

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error writing link ID to file:", err);
    } else {
      console.log(`Link ID successfully saved to ${filePath}`);
    }
  });
};

// Make API Call to Create the Payment Link
axios
  .post(`${baseURL}/links`, request, {
    headers: {
      "Content-Type": "application/json",
      "x-client-id": Cashfree.XClientId,
      "x-api-version": "2022-09-01",
      "x-client-secret": Cashfree.XClientSecret,
    },
  })
  .then((response) => {
    console.log("Payment Link creation successful:", response.data);
    const linkId = response.data.link_id;

    // Save the Link ID to a File
    writeLinkIdToFile(linkId);
  })
  .catch((error) => {
    console.error(
      "Error while creating payment link:",
      error.response?.data || error.message
    );
  });
