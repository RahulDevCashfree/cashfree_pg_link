const axios = require("axios");
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

// Function to Get Orders Associated with a Payment Link
const getOrdersForPaymentLink = (status) => {
  try {
    // Read the `link_id` from the JSON file
    const filePath = "./link_data.json"; // Path to the file
    const fileContent = fs.readFileSync(filePath, "utf8"); // Read file content
    const { link_id: linkId } = JSON.parse(fileContent); // Extract `link_id`

    // Construct URL with Query Parameter for Status
    const url = `${baseURL}/links/${linkId}/orders?status=${status}`;

    // Make API Call to Get Orders
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": Cashfree.XClientId,
          "x-client-secret": Cashfree.XClientSecret,
        },
      })
      .then((response) => {
        console.log(`Orders with status '${status}':`, response.data);
      })
      .catch((error) => {
        console.error(
          `Error while fetching orders with status '${status}':`,
          error.response?.data || error.message
        );
      });
  } catch (err) {
    console.error("Error reading or parsing link_data.json:", err.message);
  }
};

// Fetch Orders (Uncomment the required call)
// Get all orders
getOrdersForPaymentLink("ALL");

// Get only paid orders
// getOrdersForPaymentLink("PAID");
