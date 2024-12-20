import { useState, useCallback } from "react";
import { textToSpeechAPI } from "../services/text2SpeechAPI";

export default function useTextToSpeech() {
  const [isLoading, setIsLoading] = useState(false);
  const [audioCached, setAudioCached] = useState("");

  const speak = useCallback(
    async function (text) {
      setIsLoading(true);

      if (!audioCached || audioCached.text !== text) {
        const audioData = await textToSpeechAPI(text);
        setAudioCached(audioData);
        playAudio(audioData);
      } else {
        audioCached.play();
      }

      setIsLoading(false);
  }, [audioCached]);

  function playAudio(audioData) {
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioData), (c) => c.charCodeAt(0))],
      { type: "audio/mp3" }
    );
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    if (!audioCached) setAudioCached(audio);
    audio.play();
  }

  return { isLoading, speak };
}
