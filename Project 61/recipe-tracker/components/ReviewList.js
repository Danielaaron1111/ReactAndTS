// ReviewList.js — Displays a list of reviews for a recipe
// Simple presentational component — receives reviews as a prop and renders them.
// In C#, this would be a UserControl that takes a List<Review> as a parameter.

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Rating from "@mui/material/Rating";

export default function ReviewList({ reviews }) {
  if (reviews.length === 0) {
    return (
      <Typography variant="body1" sx={{ mt: 2, fontStyle: "italic" }}>
        No reviews yet. Be the first to review this recipe!
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Reviews ({reviews.length})
      </Typography>

      {/* .map() renders each review — like a foreach loop in C# Razor views */}
      {reviews.map((review) => (
        <Card key={review.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.reviewerName}
            </Typography>

            {/* MUI Rating component displays stars — readOnly means the user can't change them here */}
            <Rating value={review.rating} readOnly size="small" />

            <Typography variant="body2" sx={{ mt: 1 }}>
              {review.comment}
            </Typography>

            {/* ==============================================================
                🎯 BONUS CHALLENGE 7: Edit a Review
                Add an "Edit" button here for each review.
                You'll need a useState to track which review is being edited:
                  const [editingId, setEditingId] = useState(null);
                When editingId === review.id, show an edit form INSTEAD of the
                review text. Pre-fill the form with the existing values.
                On save, call a PUT helper you'll create in utils/api/recipes.js:
                  export async function updateReview(recipeId, reviewId, data) { ... }
                Then update state using .map():
                  setReviews(reviews.map(r => r.id === updated.id ? updated : r))
                C# analogy: .map() with conditional replacement is like:
                  reviews.Select(r => r.Id == id ? updatedReview : r).ToList()
                ============================================================== */}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
