const fs = require("fs");
const axios = require("axios");

// Environment Configuration (change 'Test' to 'Prod' as needed)
const environment = "Test"; // Use 'Test' or 'Prod'

// Dynamic configuration based on environment
const CashfreeConfig = {
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
