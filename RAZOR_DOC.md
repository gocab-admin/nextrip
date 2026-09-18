### Payment flow documentation

1. **Payment Method Selection**

     When a user initiates a booking, they must choose a paymentMethod. The system supports:
       **razorpay** → Uses Razorpay as the payment gateway.
       **stripe** → Uses Stripe as the payment gateway.
     The flow branches depending on the selected method.


2. **Payment Flow**

   **Razor Pay**

      **Purpose: Initiates a booking and generates a Razorpay order if payment is required**
      -**Input Parameters**:
       "listingId": Unique identifier of the listing,
       "currency": Currency type,
       "paymentMethod" : razorpay,
       "amount": Total amount to be charged,
       "userId": Unique identifier of the user making the booking.
     -**Process**:
       Validate the booking request.
       Retrieve listing details and user information.
       Calculate total payable amount.
       create a Razorpay order:
         Convert amount to paise.
         Generate a unique receipt ID.
         Call Razorpay API to create an order.
         Store the Razorpay Order ID.

  **Stripe**
     
     **Purpose: Initiates a booking and generates a stripe paymentIntent if payment is required**
      -**Input Parameters**:
       "listingId": Unique identifier of the listing,
       "currency": Currency type,
       "paymentMethod" : stripe,
       "amount": Total amount to be charged,
       "userId": Unique identifier of the user making the booking.
     -**Process**:
       Validate the booking request.
       Retrieve listing details and user information.
       Calculate total payable amount.
       create a Stripe payment intent:
         Convert amount to cents.
         Create a Stripe PaymentIntent.
         Attach a customer ID.
         Store the Stripe PaymentIntent ID.
         Return the client secret to the frontend.



2. **Payment Verification**

   **Razor Pay**

       **Purpose: Validates the payment signature after a successful transaction**
       -**Input Parameters**:
            "razorpay_order_id"
            "razorpay_payment_id"
            "razorpay_signature"
       -**Process**:
            Generate HMAC SHA256 signature using razorpay_secret.
            Compare generated signature with razorpay_signature.
       -**Response**:
            Success: { "verified": true }
            Failure: { "error": "Signature mismatch" }


3. **Adding Bank**
    -**Create Contact**
       **Endpoint: https://api.razorpay.com/v1/contacts**
       **Purpose: Creates a contact for payouts**
      -**Input Parameters**:
           "name"
           "email"
           "phone"
           "reference_id"
           "notes"
      -**Process**:
           Calls Razorpay API to create a contact.
      -**Response**:
           Contact ID will be generated.Based on this contactId, the fund account will be created.

    -**Create Fund Account**
       **Endpoint: https://api.razorpay.com/v1/fund_accounts**
       **Purpose: Creates a fund account linked to a contact**
      -**Input Parameters**:
           "contact_id"
           "account_number"
           "ifsc"
           "bank_name"
           "account_holder_name"
           "email"
           "phone"
      -**Process**:
            Calls Razorpay API to create a fund account.
      -**Response**:
            Fund account details will be generated with a unique id for each bank.
    Both contact_id and fundaccount_id will be stored in the Bank collection for later use.

4. **Update Contact**

      **Purpose: Updates an existing Razorpay contact**
      **Endpoint: https://api.razorpay.com/v1/contacts/${contactId}**

      -**Input Parameters**:
           "contactId"
           "name"
           "email"
           "phone"
           "reference_id"
           "notes"
      -**Process**:
           Calls Razorpay API to update contact details.
      -**Response**:
           Updated contact details.


4. **Deactivate Contact**

     **Purpose: Deactivates a Razorpay contact**
     **Endpoint: https://api.razorpay.com/v1/contacts/${contactId}**

     -**Input Parameters**:
          "contactId"
          "activeStatus"
     -**Process**:
           Calls Razorpay API to deactivate a contact.
     -**Response**:
           Deactivation status will updated.

5. **Deactivate Fund Account**

   **Purpose: Deactivates a Razorpay fund account**
   **Endpoint: https://api.razorpay.com/v1/fund_accounts/${fundAccountId}**

   -**Input Parameters**:
       "fundAccountId"
       "activeStatus"
   -**Process**:
        Calls Razorpay API to deactivate a fund account.
   -**Response**:
        Deactivation status will updated.

5. **Payouts**
     **Retrieve Razorpay Balance**
         **Purpose: Fetches the available balance in the Razorpay account**
         **Endpoint: https://api.razorpay.com/v1/balance**
         -**Process**:
             Calls Razorpay API to retrieve balance.
         -**Response**:
             Returns balance details of primary account.
     **Create Payout**
         **Purpose: Initiates a payout to a user’s bank account**
         **Endpoint: https://api.razorpay.com/v1/payouts**

     -**Input Parameters**:
              "account_number" (Admin's Razorpay account number)
              "fund_account_id" (User’s fund account ID)
              "amount" (Amount in paise)
              "currency"
              "mode" (NEFT, IMPS, UPI, etc.)
              "purpose" (Payout purpose)
              "queue_if_low_balance" (Boolean to queue payout if balance is insufficient)
              "reference_id"
              "notes"

    -**Process**:
            Calls Razorpay API to process the payout.
    -**Response:**
            Payout ID and transaction details.














