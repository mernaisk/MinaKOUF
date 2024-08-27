const express = require("express");
const admin = require("firebase-admin");
const app = express();

const serviceAccount = require("../credential.json");
console.log("imhere");
// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // Or use a service account key
});

app.use(express.json());

// Route to handle GET request to the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Firebase Admin APIiiiiiiiiiiii");
});

// Route to set user roles
app.post("/setUserRole", async (req, res) => {
  const { uid, role } = req.body; // Extract uid and role from request body

  console.log(`Received UID: ${uid}, Role: ${role}`); // Log the parameters

  try {
    // Set custom claims on the user
    await admin.auth().setCustomUserClaims(uid, { role });
    const user = await admin.auth().getUser(uid);
    res.status(200).send(`Role ${role} set for user ${uid} with user ${user.customClaims.role}`);
    console.log(user.customClaims);
  } catch (error) {
    res.status(500).send(`Error setting role: ${error.message}`);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
