import { Router } from "express";
import cloudinary from "../lib/cloudinary.js";
import { Book } from "../models/book.model.js";
import protectRoute from "../middleware/auth.middleware.js";

const router = Router();

// router.post("/", protectRoute, async (req, res) => {
//   try {
//     const { title, caption, rating, image } = req.body;

//     if (!title || !caption || !rating || !image) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const uploadResponse = await cloudinary.uploader.upload(image);
//     const imageUrl = uploadResponse.secure_url;

//     const newBook = new Book({
//       title,
//       caption,
//       rating,
//       image: imageUrl,
//       user: req.user._id,
//     });

//     await newBook.save();

//     res.status(201).json(newBook);
//   } catch (error) {
//     console.error("Error creating book:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Upload to Cloudinary (assumes image is base64 or public URL)
    const uploadResponse = await cloudinary.uploader.upload(image);
    const imageUrl = uploadResponse.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating: numericRating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();

    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all books with pagination
// This endpoint retrieves all books, supports pagination, and populates user details
router.get("/", protectRoute, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage");

    const totalBooks = await Book.countDocuments();

    res.send({
      books,
      currentPage: page,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: error.message });
  }
});

router.get("/user", protectRoute, async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching user books:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user is the owner of the book
    if (book.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }

    // Optionally, delete the image from Cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    // Delete the book
    await book.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
