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
  {
    id: 4,
    name: "Fleet Coffee",
    address: "2622 E 6th St, Austin, TX",
    tags: ["wifi", "quiet", "cozy"],
    rating: 4.6,
  },
  {
    id: 5,
    name: "Radio Coffee & Beer",
    address: "4204 Menchaca Rd, Austin, TX",
    tags: ["outdoor", "social", "late-night"],
    rating: 4.4,
  },
  {
    id: 6,
    name: "Blue Owl Coffee",
    address: "2401 E 6th St, Austin, TX",
    tags: ["wifi", "study-spot"],
    rating: 4.3,
  },
  {
    id: 7,
    name: "Cenote",
    address: "1010 E 9th St, Austin, TX",
    tags: ["outdoor", "cozy", "pastries"],
    rating: 4.5,
  },
  {
    id: 8,
    name: "Houndstooth Coffee",
    address: "4212 Guadalupe St, Austin, TX",
    tags: ["wifi", "quiet", "study-spot"],
    rating: 4.6,
  },
  {
    id: 9,
    name: "Merit Coffee",
    address: "222 W Ave, Austin, TX",
    tags: ["wifi", "cozy"],
    rating: 4.4,
  },
  {
    id: 10,
    name: "Genuine Joe Coffeehouse",
    address: "2001 W Anderson Ln, Austin, TX",
    tags: ["wifi", "quiet", "study-spot"],
    rating: 4.3,
  },
  {
    id: 11,
    name: "Buzz Mill Coffee",
    address: "1505 Hardy Ave, Austin, TX",
    tags: ["outdoor", "social", "late-night", "pet-friendly"],
    rating: 4.2,
  },
  {
    id: 12,
    name: "Halcyon",
    address: "218 W 4th St, Austin, TX",
    tags: ["wifi", "late-night", "social"],
    rating: 4.1,
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

  // basic validation
  if (!criteria || typeof criteria !== "string" || criteria.trim().length < 3) {
    return res.status(400).json({ error: "Please enter a more specific preference (at least a few words)." });
  }

  if (criteria.length > 200) {
    return res.status(400).json({ error: "That's a bit long — try a shorter description." });
  }

  const shopSummaries = shops
    .map(
      (shop) =>
        `${shop.name}, located at ${shop.address}, has a rating of ${shop.rating} and tags: ${shop.tags.join(", ")}`,
    )
    .join("\n");

  const prompt = `Given the following coffee shops:\n${shopSummaries}\n\nA user is looking for a coffee shop matching this preference: "${criteria}".\n\nIf this preference is nonsensical, offensive, or completely unrelated to finding a coffee shop (e.g. random characters, unrelated topics), respond with exactly: "I couldn't understand that preference — try describing what you're looking for, like 'quiet with good wifi'."\n\nOtherwise, recommend the best matching shop and briefly explain why.`;

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
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = await response.json();
    const recommendation = data.candidates[0].content.parts[0].text;
    res.json({ recommendation });
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    res.status(500).json({ error: "Something went wrong getting a recommendation. Please try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
