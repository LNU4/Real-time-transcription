"use client";
import { useState, useRef, useEffect } from "react";


declare global {
    interface Window {
        webkitSpeechRecognition: any;
    }
}
//Recording component that is used to record the user's voice and save it to a file.
export default function Recording() {
    //States for the recording component.
    const [isRecording, setIsRecording] = useState<boolean>(false);
    //State for the recording finished.
    const [recordingFinished, setRecordingFinished] = useState<boolean>(false);
    //State for the transcript.
    const [transcript, setTranscript] = useState<string>("");
    //State for the language.
    const [language, setLanguage] = useState<string>("en-US");
    //Ref for the recognition object.
    const recognitionRef = useRef<any>(null);
    //Function to start recording.
    const startRecording = () => {
        setIsRecording(true);
        //Create a new recognition object.
        recognitionRef.current = new window.webkitSpeechRecognition();
        //Set the continuous to true.
        recognitionRef.current.continuous = true;
        //Set the interim results to false.
        recognitionRef.current.interimResults = false; 
        //Set the language to the language state.
        recognitionRef.current.lang = language; 
        //On result event.
        recognitionRef.current.onresult = (event: any) => {
            //Set the final transcript to the transcript state.
            let finalTranscript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) { 
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(prevTranscript => prevTranscript + finalTranscript);
        }

        //Start the recording.
        recognitionRef.current.start();
    }
    //Effect to clean up the recognition object.
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            };
        }
    },[])
    //Function to stop recording.
    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        };
        setIsRecording(false);
    }

    //Function to toggle recording.
    const handleToggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    }

    //Function to download the transcript.
    const downloadTranscript = () => {
        const element = document.createElement("a");
        const file = new Blob([transcript], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "transcript.txt";
        document.body.appendChild(element);
        element.click();
    }

    //Return the recording component.
    return (
        <div className="flex flex-col items-center justify-start h-screen w-full bg-gray-100">
            {/* Logo section */}
            <div className="text-center mb-4 w-full">
                <h1 className="text-2xl font-bold">Real time transcription</h1>
            </div>
            {/* Transcript section */}
            <div className="w-full">
                {(isRecording || transcript) && (
                    <div className="w-1/4 m-auto rounded-md border p-4 bg-white shadow-lg">
                        <div className="flex-1 flex w-full justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {recordingFinished ? "Recording finished" : "Recording..."}
                                </p>
                                <p className="text-sm">
                                    {recordingFinished ? "Recording is finished" : "Click the button to start recording"}
                                </p>
                            </div>

                            {isRecording && (
                                <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse">
                                    <img src="/path/to/mic-logo.png" alt="Mic Logo" className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                    </div>
                )} 
                
                {transcript && (
                    <div className ="border rounded-md p-2 mt-4 bg-white shadow-lg">
                        <p className="mb-0">{transcript}</p>
                    </div>
                )}

                {/*Buttons section */}
                <div className="flex items-center w-full mt-10">
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value)} 
                        className="m-auto flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded">
                        <option value="en-US">English</option>
                        <option value="sv-SE">Swedish</option>
                        {/* Add more languages as needed */}
                    </select>
                    {isRecording ? (
                        <button onClick={handleToggleRecording}
                        className= "m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">
                            Stop Recording
                        </button>
                    ) : (
                        <button onClick={handleToggleRecording}
                        className= "m-auto flex items-center justify-center bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded">
                            Start Recording
                        </button>
                    )}
                    <button onClick={downloadTranscript}
                    className= "m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">
                        Download Transcript
                    </button>
                </div>
            </div>
        </div>
    )
}