async function postFormData(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok (status 200-299)
    if (!response.ok) {
      const errorDetails = await response.text(); // Log error details
      throw new Error(`Network response was not ok: ${errorDetails}`);
    }

    // Parse the JSON response
    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
}

document
  .getElementById("calculate-tax")
  .addEventListener("click", async function (e) {
    e.preventDefault();
    try {
      // Get the selected transaction type
      const transactionType = document.querySelector(
        'input[name="transactionType"]:checked'
      )?.value;

      if (!transactionType) {
        throw new Error("Transaction type not selected");
      }

      let formData = {};

      if (transactionType === "buying") {
        // Handle buying property
        const propertyValue = document.getElementById("property-value")?.value;
        const underConstruction = document.querySelector(
          'input[name="underConstruction"]:checked'
        )?.value;
        const propertyType = document.getElementById("property-type")?.value;

        if (!propertyValue || !propertyType) {
          throw new Error("Required fields missing for buying property");
        }

        formData = {
          propertycost: parseFloat(propertyValue) || 0,
          type: propertyType,
          underconstruction: underConstruction === "yes", // Convert to boolean
        };

        console.log(formData);

        let form = document.getElementById("mainform");
        form.style.display = "none";
        const answer = await postFormData("/property/house/buying", formData);
        console.log(answer);
        // Access the entire response-section
        let responseSection = document.querySelector('.response-section');
        

        // Access individual elements by their IDs
        let aiAnswer = document.getElementById("ai-answer");
        let statement = document.getElementById("statement");
        let stampDuty = document.getElementById("stamp-duty");
        let registration = document.getElementById("registration");
        let gst = document.getElementById("gst");
        let tds = document.getElementById("tds");
        let totalPayable = document.getElementById("total-payable");



        // Update the content of the elements with the values from the response
        aiAnswer.textContent = answer.aianswer;
        statement.textContent = answer.statement;
        stampDuty.textContent = answer.stampduty;
        registration.textContent = answer.registration;
        gst.textContent = answer.GST;
        tds.textContent = answer.TDS;
        totalPayable.textContent = answer.totalPayable;
        responseSection.style.display = 'block';


        
      } else if (transactionType === "selling") {
        // Handle selling property
        const purchasePrice = document.getElementById("purchase-price")?.value;
        const improvementCost =
          document.getElementById("improvement-cost")?.value;
        const purchaseDate = document.getElementById("purchase-date")?.value;
        const sellingPrice = document.getElementById("selling-price")?.value;

        if (!purchasePrice || !sellingPrice || !purchaseDate) {
          throw new Error("Required fields missing for selling property");
        }

        formData = {
          purchasePrice: parseFloat(purchasePrice) || 0,
          salePrice: parseFloat(sellingPrice) || 0,
          improvementCost: parseFloat(improvementCost) || 0,
          purchaseDate: purchaseDate,
        };
        console.log(formData);
        const answer = await postFormData("/property/house/selling", formData);
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      // Optionally show a user-friendly error message here
    }
  });
