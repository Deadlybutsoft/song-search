import { NextResponse } from 'next/server';
import FirecrawlApp from '@mendable/firecrawl-js';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY || '' });

export async function POST(req: Request) {
    try {
        const { lyrics } = await req.json();

        if (!lyrics) {
            return NextResponse.json({ error: 'Lyrics are required' }, { status: 400 });
        }

        if (!process.env.FIRECRAWL_API_KEY) {
            console.error("FIRECRAWL_API_KEY is missing from environment!");
            return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
        }

        const searchQuery = `${lyrics} song lyrics artist name`;
        console.log("--- FIRECRAWL SEARCH ---");
        console.log("Query:", searchQuery);

        // Firecrawl v4 search() returns SearchData: { web?: [], news?: [], images?: [] }
        // It does NOT return { success, data } like the old API.
        const res = await app.search(searchQuery, { limit: 3 }) as any;

        console.log("--- RAW FIRECRAWL RESPONSE ---");
        console.log(JSON.stringify(res, null, 2));

        // Handle the v4 response structure: results are in res.web[]
        // But also handle legacy format where results might be in res.data[]
        let webResults: any[] = [];

        if (Array.isArray(res?.web)) {
            // New v4 format: { web: [...], news: [...], images: [...] }
            webResults = res.web;
        } else if (Array.isArray(res?.data)) {
            // Legacy format: { success: true, data: [...] }
            webResults = res.data;
        } else if (Array.isArray(res)) {
            // Sometimes the SDK returns a raw array
            webResults = res;
        }

        if (webResults.length === 0) {
            console.log("No results found.");
            return NextResponse.json({
                result: "No matching songs found for those lyrics. Ask the user to try different lyrics.",
                songs: []
            });
        }

        console.log("Found", webResults.length, "web results.");

        // Build structured results for both the AI and the UI
        const songs: any[] = [];
        const textResults: string[] = [];

        webResults.forEach((item: any, i: number) => {
            const title = item.title || "Unknown";
            const description = item.description || item.snippet || "";
            const url = item.url || "";

            textResults.push(`[Result ${i + 1}] ${title} - ${description}`);
            songs.push({ title, description, url });
        });

        const resultText = "Web search results for the lyrics:\n" + textResults.join("\n");
        console.log("--- SEARCH COMPLETE ---");

        return NextResponse.json({
            result: resultText,
            songs: songs
        });

    } catch (error: any) {
        console.error('SERVER ERROR:', error?.message || error);
        return NextResponse.json({ error: error?.message || 'Search failed' }, { status: 500 });
    }
}
