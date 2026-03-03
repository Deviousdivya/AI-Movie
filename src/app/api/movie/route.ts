import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  // 1. Extract the ID from the URL
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  // Log for debugging
  console.log("Request received for ID:", id);

  if (!id) {
    return NextResponse.json({ error: 'IMDb ID is required' }, { status: 400 });
  }

  try {
    // 2. Access the API Key from environment variables 
    const apiKey = process.env.OMDB_API_KEY;

    if (!apiKey) {
      console.error("CRITICAL ERROR: OMDB_API_KEY is not defined in .env.local");
      return NextResponse.json({ error: 'Server Configuration Error: Missing API Key' }, { status: 500 });
    }

    // 3. Fetch data from OMDb [cite: 25]
    const omdbUrl = `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`;
    const response = await axios.get(omdbUrl);

    // Check if OMDb returned a specific error (like "Invalid API Key")
    if (response.data.Response === "False") {
      console.error("OMDb API Error:", response.data.Error);
      return NextResponse.json({ error: response.data.Error }, { status: 404 });
    }

    // 4. Return the required movie details [cite: 17, 18, 19, 20]
    return NextResponse.json({
      title: response.data.Title,
      poster: response.data.Poster,
      year: response.data.Year,
      rating: response.data.imdbRating,
      cast: response.data.Actors,
      plot: response.data.Plot,
      // Placeholder for AI - we will add Gemini logic here next [cite: 21, 22]
      aiSentiment: "The audience seems to love the pacing and the character development in this classic.",
      sentimentClass: "positive" 
    });

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return NextResponse.json({ error: 'Failed to communicate with movie database' }, { status: 500 });
  }
}