const fs = require("fs");
const axios = require("axios");

// Environment Configuration (change 'Test' to 'Prod' as needed)
const environment = "Test"; // Use 'Test' or 'Prod'

// Dynamic configuration based on environment
const CashfreeConfig = {
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

// Base URL based on environment
const baseURL =
  CashfreeConfig.XEnvironment === "Prod"
    ? "https://api.cashfree.com/pg"
    : "https://sandbox.cashfree.com/pg";

try {
  // Read the `link_id` from the JSON file
  const filePath = "./link_data.json"; // Path to the file
  const fileContent = fs.readFileSync(filePath, "utf8"); // Read file content
  const { link_id: linkId } = JSON.parse(fileContent); // Extract `link_id`

  // Make API call to get payment link status
  axios
    .get(`${baseURL}/links/${linkId}`, {
      headers: {
        "Content-Type": "application/json",
        "x-api-version": "2022-09-01",
        "x-client-id": CashfreeConfig.XClientId,
        "x-client-secret": CashfreeConfig.XClientSecret,
      },
    })
    .then((response) => {
      console.log("Payment Link Status:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error while fetching payment link status:",
        error.response?.data || error.message
      );
    });
} catch (err) {
  console.error("Error reading or parsing link_data.json:", err.message);
}
