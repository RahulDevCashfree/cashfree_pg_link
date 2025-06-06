const axios = require("axios");
const fs = require("fs"); // To handle file operations

// Environment Configuration (Change 'Test' to 'Prod' as needed)
const environment = "Test"; // Use 'Test' or 'Prod'

// Dynamic Cashfree Credentials Based on Environment
const Cashfree = {
  XClientId:
    environment === "Test"
      ? "11123595750e973ecc95c94ec5532111" // Test Client ID
      : "145084e43c71b20eab47a2a4b80541", // Production Client ID
  XClientSecret:
    environment === "Test"
      ? "TEST307e06bddd583cc3f86edf02f410fa8a69653d7d" // Test Client Secret
      : "4fd43d83c9728bcd520f6018dea066d68cdc41d", // Production Client Secret
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
