const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust limit as needed
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// MongoDB Setup
mongoose.connect("mongodb://localhost:27017/image-editor", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

const imageSchema = new mongoose.Schema({
  imageUrl: String,
});

const Image = mongoose.model("Image", imageSchema);

// Cloudinary Configuration
cloudinary.config({
  cloud_name: "dycpqrh2n", // Replace with your Cloudinary cloud name
  api_key: "887442727788494", // Replace with your Cloudinary API key
  api_secret: "iJ_zEPVps-knWZEDsMksgQSrfkA", // Replace with your Cloudinary API secret
});

// Multer Storage Configuration with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "image-uploads", // Folder name in your Cloudinary account
    format: async (req, file) => "jpg", // Format for the uploaded images
    public_id: (req, file) => `${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

const upload = multer({ storage });

// Route to upload image
app.post("/api/upload-image", upload.single("image"), (req, res) => {
  const imageUrl = req.file.path; // Cloudinary URL

  // Save the image URL to MongoDB
  const newImage = new Image({ imageUrl });
  newImage
    .save()
    .then(() => {
      res.status(200).send({ imageUrl });
    })
    .catch((err) => {
      console.error("Error saving image to DB:", err);
      res.status(500).send("Error saving image.");
    });
});

// Route to send email with the image URL (preview content)
app.post("/api/send-email", (req, res) => {
  const { content } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "megarajan55@gmail.com", // Replace with your email
      pass: "jrwg fhjo guri toat",   // Replace with your app-specific password
    },
  });

  let mailOptions = {
    from: 'megarajan55@gmail.com', // Sender address
    to: "renugajagadeesan@gmail.com,megarajan55@gmail.com",  // Replace with recipient's email
    subject: "Image Preview",
    html: content, // The HTML content to be sent in the email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
    res.status(200).send("Email sent successfully!");
  });
});

const port = 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
