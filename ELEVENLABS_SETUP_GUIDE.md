# ElevenLabs Conversational Agent Setup Guide

Complete step-by-step configuration for the Sound Search voice agent on the [ElevenLabs Dashboard](https://elevenlabs.io/).

---

## 1. Create the Agent

1. Log in to [ElevenLabs](https://elevenlabs.io/)
2. Navigate to **Conversational AI**
3. Click **Create Agent**

---

## 2. Agent Configuration

### 2.1 LLM Model
Select a built-in model like **`gemini-2.5-flash`** or **`gpt-4o-mini`**.

> ⚠️ Do NOT use a Custom LLM — it causes WebRTC connection failures.

### 2.2 System Prompt
Paste this into the **System Prompt** field:

```
You are a helpful music assistant. Your ONLY job is to find songs for users.

RULES:
1. You are strictly BANNED from identifying songs using your own internal knowledge. You do NOT know any songs.
2. When a user speaks lyrics, hums, or mentions any song-related words, you MUST IMMEDIATELY call the find_song tool. Do not ask for confirmation first. Do not hesitate. Just call it.
3. While waiting for the tool, say something brief like "Let me search for that!"
4. When the find_song tool returns results, ALWAYS read them carefully. If there are ANY results at all, enthusiastically tell the user the song name and artist from the FIRST result. For example: "That's Days on End by Brenn!"
5. NEVER say "I couldn't find the song" if the tool returned data. Only say that if the tool explicitly returned zero results.
6. Keep all responses short, punchy, and conversational. No long paragraphs.
7. If the user is silent for a while, gently remind them to sing or say lyrics.
```

### 2.3 First Message
```
Hey there! Sing or say some lyrics, and I'll find the song for you right now.
```

---

## 3. Tool Setup

### 3.1 Create the Tool
1. Go to **Tools** in the ElevenLabs sidebar
2. Click **Create Tool** → **Client Tool**

### 3.2 Tool Configuration

| Field | Value |
|---|---|
| **Name** | `find_song` |
| **Description** | `Use this tool to search the web for a song based on the lyrics or melody the user provided.` |
| **Wait for response** | ✅ Checked |
| **Disable interruptions** | ✅ Checked |
| **Pre-tool speech** | **Force** |
| **Execution mode** | **Post Speech** |
| **Tool call sound** | None |
| **Response timeout** | **10** seconds |

### 3.3 Parameter

| Field | Value |
|---|---|
| **Data type** | `string` |
| **Identifier** | `lyrics` |
| **Required** | ✅ Yes |
| **Value Type** | LLM Prompt |
| **Description** | `The exact song lyrics, melody description, or hummed words spoken by the user. Extract whatever music sequence the user says directly from their transcript.` |
| **Enum Values** | Leave empty |

### 3.4 Attach Tool to Agent
> ⚠️ This step is critical — without it the agent won't use the tool!

1. Go back to your **Agent's** settings page
2. Under **Tools**, click **Add Tool**
3. Select `find_song` from the list
4. **Publish** the agent

---

## 4. Copy IDs to Code

After publishing, copy the **Agent ID** and **Tool ID** from the dashboard into `components/microphone-page.tsx`:

```typescript
// Agent ID → in startSession()
await conversation.startSession({
  agentId: 'agent_0901kmm0thpmf78sajrcfmc2hr8r',
  connectionType: 'webrtc',
});

// Tool ID + name → in clientTools
clientTools: {
  find_song: async (params) => handleFindSong(params),
  tool_1401kmm257xaet9rp03n6k64xq2j: async (params) => handleFindSong(params),
}
```

---

## 5. Environment Variables

Create a `.env.local` file in the project root:

```env
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
```

Get your key from [firecrawl.dev](https://firecrawl.dev/) → Dashboard → API Keys.

---

## 6. Test It

1. Run `pnpm dev`
2. Open [http://localhost:3000](http://localhost:3000)
3. Click **Start Finding Now** → Tap the mic
4. Say: *"I've been roaming around, always looking down at all I see"*
5. Expected: Agent searches → announces **"Use Somebody by Kings of Leon"**
