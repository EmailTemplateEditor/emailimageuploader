import React, { useState } from "react";
import axios from "axios";

const ImageEditor = () => {
  const [image, setImage] = useState(null);
  const [previewContent, setPreviewContent] = useState("");

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      // Upload the image to the backend
    axios
  .post("http://localhost:9000/api/upload-image", formData)
  .then((response) => {
    const imageUrl = response.data.imageUrl;
    console.log("Uploaded Image URL:", imageUrl); // Debugging
    setImage(imageUrl);  // Store the image URL in the state
setPreviewContent(`
  <div>
    <h3>Image Preview</h3>
    <img src="${imageUrl}" alt="Preview" style="max-width: 100%;"/>
  </div>
`);
  })
  .catch((error) => {
    console.error("Error uploading image:", error);
  });
    }
  };

  // Handle Save and Send Email
  const handleSaveAndSendEmail = () => {
    // Send email with the preview content
    axios
      .post("http://localhost:9000/api/send-email", { content:previewContent })
      .then((res) => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
      });
  };

  return (
    <div className="container" style={{ display: "flex" }}>
      {/* Left Side (Editor) */}
      <div className="left-side" style={{ flex: 1, padding: "20px" }}>
        <h2>Upload Image</h2>
        <input
          type="file"
          onChange={handleImageUpload}
          className="upload-input"
          accept="image/*"
        />
        <br />
        <button onClick={handleSaveAndSendEmail} className="save-button">
          Save & Send Email
        </button>
      </div>

      {/* Right Side (Preview) */}
      <div className="right-side" style={{ flex: 1, padding: "20px" }}>
        <h2>Preview</h2>
        <div className="preview" style={{ border: "1px solid #ddd", padding: "10px" }}>
          {image ? (
            <img src={image} alt="Preview" style={{ maxWidth: "100%" }} />
          ) : (
            <p>No image uploaded</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEditor;
