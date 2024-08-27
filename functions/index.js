const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Example: A function to set custom user roles
exports.setUserRole = functions.https.onCall(async (data, context) => {
  const {uid, role} = data;
  // Ensure the caller has the appropriate permissions
  if (
    !context.auth ||
    !context.auth.token ||
    context.auth.token.role !== "SuperAdmin"
  ) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "Only SuperAdmins can set roles."
    );
  }

  await admin.auth().setCustomUserClaims(uid, {role});
  return { message: `Role ${role} set for user ${uid}` };
});
