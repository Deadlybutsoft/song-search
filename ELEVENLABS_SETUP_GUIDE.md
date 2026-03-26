# ElevenLabs Agent Setup Guide

Step-by-step configuration on [elevenlabs.io](https://elevenlabs.io/) dashboard only.

---

## 1. Create Agent

1. Go to **Conversational AI** → **Create Agent**
2. Set LLM to **`gemini-2.5-flash`** (do NOT use Custom LLM)

---

## 2. System Prompt

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

## 3. First Message

```
Hey there! Sing or say some lyrics, and I'll find the song for you right now.
```

---

## 4. Create Tool

Go to **Tools** → **Create Tool** → **Client Tool**

### Tool Settings

| Setting | Value |
|---|---|
| Name | `find_song` |
| Description | `Use this tool to search the web for a song based on the lyrics or melody the user provided.` |
| Wait for response | ✅ Checked |
| Disable interruptions | ✅ Checked |
| Pre-tool speech | **Force** |
| Execution mode | **Post Speech** |
| Tool call sound | None |
| Response timeout | **10** seconds |

### Parameter

| Setting | Value |
|---|---|
| Data type | `string` |
| Identifier | `lyrics` |
| Required | ✅ Yes |
| Value Type | LLM Prompt |
| Description | `The exact song lyrics, melody description, or hummed words spoken by the user. Extract whatever music sequence the user says directly from their transcript.` |
| Enum Values | Leave empty |

---

## 5. Attach Tool to Agent

> ⚠️ Without this step the agent will NOT use the tool!

1. Go back to your **Agent's** settings
2. Under **Tools** → click **Add Tool**
3. Select `find_song`

---

## 6. Publish

Click **Publish** and copy the **Agent ID** and **Tool ID** for the codebase.
