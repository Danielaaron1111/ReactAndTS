// ReviewForm.js — Controlled form to submit a review for a recipe
//
// STEP 6 CONCEPT: Forms, onSubmit, e.preventDefault(), controlled inputs, error handling
//
// A "controlled form" means every input's value is stored in React state.
// In C#, this is like data binding in WPF/MAUI where each input is bound to a property.
// When the form submits, we read from state (not from the DOM directly).
//
// e.preventDefault() stops the browser from doing a full page reload on form submit.
// In C# Blazor, @onsubmit already prevents default. In plain HTML/React, you must do it manually.

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { postReview } from "@/utils/api/recipes";

export default function ReviewForm({ recipeId, onReviewAdded }) {
  // Multiple useState calls — each tracks one form field
  // In C#, these would be individual properties: public string ReviewerName { get; set; }
  const [reviewerName, setReviewerName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");

  // Form submit handler — async because we POST to the API
  const handleSubmit = async (e) => {
    // CRITICAL: preventDefault() stops the browser from reloading the page
    // Without this, the form would do a traditional HTML form submission (full page reload)
    // In C#, Blazor's @onsubmit handles this automatically, but in React you must do it manually
    e.preventDefault();

    // Clear any previous error
    setError("");

    // try/catch wraps the fetch call — if the API fails, we show an error message
    // In C#: try { await httpClient.PostAsync(...); } catch (Exception ex) { ... }
    try {
      const newReview = await postReview(recipeId, {
        reviewerName,
        comment,
        rating,
      });

      // Notify the parent component that a new review was added
      // onReviewAdded is a callback prop — like an event in C# (Action<Review> OnReviewAdded)
      onReviewAdded(newReview);

      // Reset form fields after successful submission
      setReviewerName("");
      setComment("");
      setRating(5);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
      console.error("Error submitting review:", err);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Write a Review
      </Typography>

      {/* Show error message if the fetch failed */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* onSubmit calls our handler when the user clicks the submit button or presses Enter */}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Controlled input: value is tied to state, onChange updates state */}
        <TextField
          label="Your Name"
          variant="outlined"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          required
        />

        {/* multiline + rows turns TextField into a textarea */}
        <TextField
          label="Your Review"
          variant="outlined"
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />

        {/* Select/MenuItem is like a <select> dropdown in HTML or a ComboBox in C# WPF */}
        <FormControl>
          <InputLabel>Rating</InputLabel>
          <Select
            value={rating}
            label="Rating"
            onChange={(e) => setRating(e.target.value)}
          >
            {/* Each MenuItem is an option — like <option value="5">5 - Excellent</option> */}
            <MenuItem value={1}>1 - Poor</MenuItem>
            <MenuItem value={2}>2 - Fair</MenuItem>
            <MenuItem value={3}>3 - Good</MenuItem>
            <MenuItem value={4}>4 - Very Good</MenuItem>
            <MenuItem value={5}>5 - Excellent</MenuItem>
          </Select>
        </FormControl>

        {/* type="submit" means clicking this button triggers the form's onSubmit */}
        <Button type="submit" variant="contained" color="primary">
          Submit Review
        </Button>
      </Box>
    </Box>
  );
}
