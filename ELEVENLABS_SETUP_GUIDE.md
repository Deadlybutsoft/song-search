# ElevenLabs Conversational Agent Setup Guide

This document outlines the exact step-by-step configuration required on the [ElevenLabs Dashboard](https://elevenlabs.io/) to reproduce this Voice Search Agent, matching how it is hooked up in our codebase.

## 1. Agent Creation
Navigate to **Conversational AI** in your ElevenLabs developer console and click **Create Agent**.

### 1.1 System Prompt (Persona)
Your agent receives instructions on who it is and how to behave. Copy and paste this exact prompt into the **System Prompt** section:

> You are a helpful music assistant. Your ONLY job is to find songs for users.
>
> RULES:
> 1. You are strictly BANNED from identifying songs using your own internal knowledge. You do NOT know any songs.
> 2. When a user speaks lyrics, hums, or mentions any song-related words, you MUST IMMEDIATELY call the `find_song` tool. Do not ask for confirmation first. Do not hesitate. Just call it.
> 3. While waiting for the tool, say something brief like "Let me search for that!"
> 4. When the `find_song` tool returns results, ALWAYS read them carefully. If there are ANY results at all, enthusiastically tell the user the song name and artist from the FIRST result. For example: "That's Days on End by Brenn!"
> 5. NEVER say "I couldn't find the song" if the tool returned data. Only say that if the tool explicitly returned zero results.
> 6. Keep all responses short, punchy, and conversational. No long paragraphs.
> 7. If the user is silent for a while, gently remind them to sing or say lyrics.

### 1.2 First Message (Greeting)
Set the **First Message** to something welcoming so the user knows they should start singing immediately when the agent connects:

> Hey there! Sing or say some lyrics, and I'll find the song for you right now.

---

## 2. Tool Setup (Client Tool Hook)
To enable the AI to hit our Next.js backend and use Firecrawl, you must add a Custom Tool on the dashboard.

1. Go to the **Tools** section of your Agent's configuration block.
2. Click **Add Tool** -> **Client Tool**.
3. Set the **Tool Name** to exactly: `find_song` (or `find_tool` if you configured it previously).
4. Provide a **Description** for the AI: *"Use this tool to search the web for a song based on the lyrics or melody the user provided."*

### 2.1 Parameter Schema
You must explicitly define the parameter that the AI will send back to our React code. 
Create the parameter with these details:
- **Property Name**: `lyrics`
- **Type**: `string`
- **Description**: `The lyrics or vocal hum provided by the user.`
- **Required**: `Yes`

---

## 3. Codebase Integration Overview
Once your Agent configuration is saved, copy the **Agent ID** from the developer dashboard settings.

In our repository (`components/microphone-page.tsx`), we pass this custom ID back into the `@elevenlabs/react` SDK so it knows to spin up this exact agent:

```typescript
await conversation.startSession({
  agentId: 'agent_0901kmm0thpmf78sajrcfmc2hr8r', // Replace with your Agent ID
  connectionType: 'webrtc',
});
```

Finally, we map the exact tool you built in Step 2 (`find_song`) directly to our local API search function using the `useConversation` hook:

```typescript
const conversation = useConversation({
  clientTools: {
    find_song: async (parameters: any) => {
      // The AI pauses and passes the captured text, e.g. { lyrics: 'caught in a landslide' }
      // This routes to our Firecrawl endpoint over at /api/find-song and returns the web search results!
      return await handleFindSong(parameters.lyrics); 
    }
  }
});
```
