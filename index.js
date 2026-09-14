const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
//concrete data for now
const shops = [
  {
    id: 1,
    name: "Cielito Lindo Cafe",
    address: "411 Brazos St APT 101, Austin, TX",
    tags: ["wifi", "quiet"],
    rating: 4.5,
  },
  {
    id: 2,
    name: "Cafe Creme",
    address: "710 W Cesar Chavez St, Austin, TX",
    tags: ["outdoor", "social"],
    rating: 4.2,
  },
  {
    id: 3,
    name: "Mozarts Coffee Roasters",
    address: "3825 Lake Austin Blvd, Austin, TX",
    tags: ["wifi", "scenic"],
    rating: 4.8,
  },
];

app.get("/api/shops", (req, res) => {
  res.json(shops);
});

//load api key from .env file

app.use(cors());
app.use(express.json());

app.post("/api/recommendations", async (req, res) => {
  const { criteria } = req.body;
  const shopSummaries = shops
    .map(
      (shop) =>
        `${shop.name}, located at ${shop.address}, has a rating of ${shop.rating} and tags: ${shop.tags.join(", ")}`,
    )
    .join("\n");
  const prompt = `Given the following coffee shops:\n${shopSummaries}\n\nPlease recommend the best coffee shop based on the following criteria: ${criteria}. Provide a brief explanation for your recommendation.`;
  // Handle recommendation logic here

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    // Handle response from the Gemini API
    const data = await response.json();
    const recommendation = data.candidates[0].content.parts[0].text;
    res.json({ recommendation });
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    res.status(500).json({ error: "Failed to fetch recommendation" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
