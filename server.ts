import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Let's configure JSON limits because base64 data for image uploading can be larger
  app.use(express.json({ limit: "15mb" }));

  // API Route for Gemini analysis
  app.post("/api/analyze", async (req: express.Request, res: express.Response) => {
    try {
      const { image, mimeType } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image received" });
      }

      // Check for Gemini API Key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ 
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY in the Secrets panel." 
        });
      }

      // Initialize GoogleGenAI SDK server-side
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      // Prepare payload
      // Remove any data URL prefix characters (e.g. "data:image/jpeg;base64,")
      const base64Data = image.includes("base64,") ? image.split("base64,")[1] : image;
      const finalMimeType = mimeType || "image/jpeg";

      const promptText = `Analyze the object in this image and fill in the structured details about it. Follow these constraints closely:
- whatIsIt: short, likely identification of the main object in the picture.
- explanation: exactly 2 simple sentences, easy for a general audience.
- englishWord: the object name in English.
- englishExample: one simple example sentence using the object's englishWord.
- didYouKnow: one interesting, accurate, educational fact about the object.
- tryThis: one short, engaging prompt encouraging the user to photograph a related object next (e.g. "Try snapping a coffee cup or some sunglasses next!").`;

      // Request structured output from gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: finalMimeType,
            },
          },
          { text: promptText }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              whatIsIt: {
                type: Type.STRING,
                description: "Short likely identification of the main object."
              },
              explanation: {
                type: Type.STRING,
                description: "Exactly 2 simple sentences explaining what it is."
              },
              englishWord: {
                type: Type.STRING,
                description: "Name of the object in English."
              },
              englishExample: {
                type: Type.STRING,
                description: "An example sentence using that name in English."
              },
              didYouKnow: {
                type: Type.STRING,
                description: "One educational/fun interesting fact about this object."
              },
              tryThis: {
                type: Type.STRING,
                description: "A friendly prompt recommending they snap a photo of a related item next."
              }
            },
            required: ["whatIsIt", "explanation", "englishWord", "englishExample", "didYouKnow", "tryThis"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("No text response received from Gemini.");
      }

      const parsedJSON = JSON.parse(responseText.trim());
      return res.json(parsedJSON);

    } catch (err: any) {
      console.error("Gemini server-side error:", err);
      return res.status(500).json({ 
        error: err.message || "An error occurred while analyzing the image." 
      });
    }
  });

  // Vite middleware for development or serving files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Bind to port 3000 and 0.0.0.0
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
});
