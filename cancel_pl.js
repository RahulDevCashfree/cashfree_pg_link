const axios = require("axios");
const fs = require("fs"); // To handle file operations

// Environment Configuration (Change 'Test' to 'Prod' as needed)
const environment = "Test"; // Use 'Test' or 'Prod'

// Dynamic Cashfree Credentials Based on Environment
const Cashfree = {
  XClientId:
    environment === "Test"
      ? "test_client_id" // Test Client ID
      : "prod_client_id", // Production Client ID
  XClientSecret:
    environment === "Test"
      ? "test_secret_key" // Test Client Secret
      : "prod_secret_key", // Production Client Secret
  XEnvironment: environment,
};

// Base URL Based on Environment
const baseURL =
  Cashfree.XEnvironment === "Prod"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

try {
  // Read the `link_id` from the JSON file
  const filePath = "./link_data.json"; // Path to the file
  const fileContent = fs.readFileSync(filePath, "utf8"); // Read file content
  const { link_id: linkId } = JSON.parse(fileContent); // Extract `link_id`

  // Make API Call to Cancel the Payment Link
  axios
    .post(`${baseURL}/links/${linkId}/cancel`, {}, {
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2023-08-01",
        "x-client-id": Cashfree.XClientId,
        "x-client-secret": Cashfree.XClientSecret,
      },
    })
    .then((response) => {
      console.log("Payment Link cancellation successful:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error while canceling the payment link:",
        error.response?.data || error.message
      );
    });
} catch (err) {
  console.error("Error reading or parsing link_data.json:", err.message);
}
