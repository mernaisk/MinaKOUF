// import nodemailer from "nodemailer";
// // import nodemailer from 
// import dotenv from "dotenv"

// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service:'gmail',
//     auth: {
//         user: process.env.MINAKOUFEMAIL,
//         pass: process.env.MINAKOUFPASSWORD
//     }
// })

// export const sendEmailAPI = async (to, subject, body) => {
//     const mailOptions = {
//       from: process.env.GMAIL_USER,
//       to,
//       subject,
//       text: body,
//     };
  
//     try {
//       await transporter.sendMail(mailOptions);
//       console.log('Email sent successfully');
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };