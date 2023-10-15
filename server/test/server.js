import express from "express";
import mysql from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import fetch from "node-fetch";
import "dotenv/config";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PORT } = process.env;

const salt = 10;

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.on("error", (err) => {
  console.error("Database error:", err);
});

//<--------PAYPAL----------?>
const base = "https://api-m.sandbox.paypal.com";

app.use(express.static("client"));

const generateAccessToken = async () => {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error("MISSING_API_CREDENTIALS");
    }
    const auth = Buffer.from(
      PAYPAL_CLIENT_ID + ":" + PAYPAL_CLIENT_SECRET
    ).toString("base64");
    const response = await fetch(`${base}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
  }
};

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
const createOrder = async (product) => {
  // use the cart information passed from the front-end to calculate the purchase unit details
  console.log(
    "shopping cart information passed from the frontend createOrder() callback:",
    product
  );

  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;
  const payload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: product.price,
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
const captureOrder = async (orderID) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only). Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

async function handleResponse(response) {
  try {
    const jsonResponse = await response.json();
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  } catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

app.post("/api/orders", async (req, res) => {
  try {
    // use the cart information passed from the front-end to calculate the order amount detals
    const { product } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(product);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

//<------------Authentication---------------->

app.post("/register", (req, res) => {
  const checkEmailSQL = "SELECT * FROM users WHERE email = ?";
  db.query(checkEmailSQL, [req.body.email], (err, results) => {
    if (err) return res.status(400).json({ error: "Database Error." });

    if (results.length > 0) {
      return res.status(400).json({ error: "Email already registered." });
    }

    // If email doesn't exist, continue with registration
    const sql = "INSERT INTO users (`email`, `password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err)
        return res.status(400).json({ error: "Error Hashing Password." });

      const values = [req.body.email, hash];
      db.query(sql, [values], (err, result) => {
        if (err) return res.status(400).json({ error: "Inserting Data Error" });
        return res.status(200).json({ success: "Success" });
      });
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) return res.status(400).json({ error: "Login Error in Server" });
    if (data.length > 0) {
      bcrypt.compare(
        req.body.password.toString(),
        data[0].password,
        (err, response) => {
          if (err)
            return res.status(400).json({ error: "Error Hashing Password." });
          if (response) {
            const email = data[0].email;
            const token = jwt.sign({ email }, "jwt-secret-key", {
              expiresIn: "1d",
            });
            res.cookie("token", token);
            return res.status(200).json({ success: "Success" });
          } else {
            res.status(400).json({ error: "Password Not Match" });
          }
        }
      );
    } else {
      return res.status(400).json({ error: "No email existed" });
    }
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: "Success" });
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(200).json({ success: "You are Authenticated" });
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
      if (err) {
        return res.status(400).json({ error: "Token is not Okey" });
      } else {
        req.name = decoded.name;
        next();
      }
    });
  }
};
app.get("/", verifyUser, (req, res) => {
  return res.status(200).json({ success: "Success" });
});

app.listen(PORT, () => {
  console.log(`running on ${PORT}`);
});
