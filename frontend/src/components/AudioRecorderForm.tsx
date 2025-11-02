import { useState, useRef, useEffect, useReducer, forwardRef, useImperativeHandle } from "react";
import styles from "./AudioRecorderForm.module.scss";
import stopButton from "../assets/stop-button.svg";
import recordButton from "../assets/record-button.svg";
import resumeButton from "../assets/resume-button.svg";
import exclamationButton from "../assets/exclamation-button.svg";
import { RecordingInfo } from "../types";
import { useCaregiverModel } from "../hooks/useCaregiverModel";

interface AudioRecorderFormProps {
    onRecordingComplete: (info: RecordingInfo) => void;
}

export interface AudioRecorderFormRef {
    stop: () => void;
}

type RecordingState = "init" | "recording" | "stopped" | "error";

type RecordingAction = { type: "toggle" } | { type: "error" };

const recordingReducer = (state: RecordingState, action: RecordingAction): RecordingState => {
    if (action.type === "error") {
        return "error";
    }

    switch (state) {
        case "recording":
            return "stopped";
        case "stopped":
            return "recording";
        case "init":
            return "recording";
        case "error":
            return "init";
        default:
            return state;
    }
};

const blobToBase64 = async (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(",")[1]; // remove data:... prefix
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const AudioRecorderForm = forwardRef<AudioRecorderFormRef, AudioRecorderFormProps>(
    ({ onRecordingComplete }, ref) => {
        const [state, dispatch] = useReducer(recordingReducer, "init");
        const { mimeTypes } = useCaregiverModel();

        const [bars, setBars] = useState<number[]>(new Array(20).fill(10));
        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
        const streamRef = useRef<MediaStream | null>(null);
        const allAudioChunksRef = useRef<Blob[]>([]);
        const animationFrameRef = useRef<number | null>(null);
        const audioContextRef = useRef<AudioContext | null>(null);
        const analyserRef = useRef<AnalyserNode | null>(null);
        const dataArrayRef = useRef<Uint8Array | null>(null);
        const isRecordingRef = useRef<boolean>(false);
        const waveformRef = useRef<HTMLDivElement | null>(null);
        const [errorMessage, setErrorMessage] = useState<string | null>(null);

        const calculateNumberOfBars = () => {
            if (!waveformRef.current) return;

            const containerWidth = waveformRef.current.offsetWidth;
            const padding = 20;
            const barWidth = 10;
            const gap = 10;
            const availableWidth = containerWidth - padding;

            const barsThatFit = Math.floor(availableWidth / (barWidth + gap));
            const calculatedBars = Math.max(1, barsThatFit);

            setBars(new Array(calculatedBars).fill(10));
        };

        const setupMediaRecorder = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                streamRef.current = stream;

                let mimeType: null | string = null;

                (mimeTypes || []).forEach((type) => {
                    if (MediaRecorder.isTypeSupported(type.type) && !mimeType) {
                        mimeType = type.type;
                    }
                });

                if (!mimeType) {
                    dispatch({ type: "error" });
                    setErrorMessage("A böngésző nem támogatja a szükséges audio formátumokat.");
                    return;
                }

                const mediaRecorder = new MediaRecorder(stream, { mimeType });
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        allAudioChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = async () => {
                    const recorder = mediaRecorderRef.current;

                    if (!recorder) {
                        return;
                    }

                    await new Promise((resolve) => setTimeout(resolve, 100));

                    const chunks = allAudioChunksRef.current.filter((c) => c.size > 0);

                    // Always call onRecordingComplete, even if there are no chunks
                    // This ensures the promise in Log.tsx resolves even if no recording was made
                    if (chunks.length === 0) {
                        onRecordingComplete({
                            audioUrl: "",
                            mimeType: recorder.mimeType,
                        });
                    } else {
                        const finalBlob = new Blob(chunks, { type: recorder.mimeType });
                        const base64Audio = await blobToBase64(finalBlob);
                        onRecordingComplete({
                            audioUrl: base64Audio,
                            mimeType: recorder.mimeType || "audio/webm",
                        });
                    }

                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((track) => track.stop());
                    }
                };
            } catch (error) {
                dispatch({ type: "error" });
                setErrorMessage("Nem sikerült hozzáférni a mikrofonhoz. Kérjük, ellenőrizze a böngésző engedélyeit.");
            }
        };

        useEffect(() => {
            calculateNumberOfBars();

            const resizeObserver = new ResizeObserver(() => {
                calculateNumberOfBars();
            });

            if (waveformRef.current) {
                resizeObserver.observe(waveformRef.current);
            }

            window.addEventListener("resize", calculateNumberOfBars);

            setupMediaRecorder();

            return () => {
                resizeObserver.disconnect();
                window.removeEventListener("resize", calculateNumberOfBars);
            };
        }, []);

        const startVisualization = async () => {
            if (!streamRef.current) return;

            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(streamRef.current);

                analyser.fftSize = 128;
                analyser.smoothingTimeConstant = 0.9;
                microphone.connect(analyser);

                audioContextRef.current = audioContext;
                analyserRef.current = analyser;
                dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

                const updateBars = () => {
                    if (!analyserRef.current || !dataArrayRef.current || !isRecordingRef.current) return;

                    analyserRef.current.getByteFrequencyData(dataArrayRef.current as Uint8Array<ArrayBuffer>);

                    const data = dataArrayRef.current;
                    const barCount = bars.length;

                    const halfCount = Math.floor(barCount / 2);
                    const dataLength = data.length;
                    const chunkSize = Math.floor(dataLength / halfCount) || 1;

                    const firstHalf: number[] = [];
                    for (let i = 0; i < halfCount; i++) {
                        let sum = 0;
                        const start = i * chunkSize;
                        const end = start + chunkSize;
                        for (let j = start; j < end && j < dataLength; j++) {
                            sum += data[j];
                        }
                        const avg = sum / chunkSize;
                        const normalized = avg / 255;
                        const height = Math.min(100, 10 + normalized * 90);
                        firstHalf.push(height);
                    }

                    const newBars: number[] = [];

                    for (let i = 0; i < halfCount; i++) {
                        newBars.push(firstHalf[halfCount - 1 - i]);
                    }
                    for (let i = 0; i < halfCount; i++) {
                        newBars.push(firstHalf[i]);
                    }

                    setBars(newBars);

                    animationFrameRef.current = requestAnimationFrame(updateBars);
                };

                updateBars();
            } catch (error) {
                console.error("Error starting visualization:", error);
            }
        };

        const stopVisualization = () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }

            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }

            analyserRef.current = null;
            dataArrayRef.current = null;

            setBars((prevBars) => new Array(prevBars.length).fill(10));
        };

        const startRecording = async () => {
            if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "recording") {
                console.warn("MediaRecorder is not ready or already recording");
                return;
            }

            if (mediaRecorderRef.current.state === "paused") {
                mediaRecorderRef.current.resume();
            } else {
                mediaRecorderRef.current.start(100);
            }
        };

        const pauseRecording = async () => {
            const recorder = mediaRecorderRef.current;
            if (!recorder || recorder.state !== "recording") return;

            recorder.pause();
        };

        const stop = async () => {
            const recorder = mediaRecorderRef.current;
            if (!recorder) {
                onRecordingComplete({
                    audioUrl: "",
                    mimeType: "audio/webm",
                });
                return;
            }

            if (recorder.state === "recording" || recorder.state === "paused") {
                recorder.stop();
            } else if (recorder.state === "inactive") {
                onRecordingComplete({
                    audioUrl: "",
                    mimeType: recorder.mimeType,
                });
            }
        };

        useEffect(() => {
            if (state === "recording") {
                startRecording();
                isRecordingRef.current = true;
                startVisualization();
            } else if (state === "stopped") {
                pauseRecording();
                isRecordingRef.current = false;
                stopVisualization();
            }
        }, [state]);

        const getButtonIcon = () => {
            switch (state) {
                case "init":
                    return recordButton;
                case "stopped":
                    return resumeButton;
                case "recording":
                    return stopButton;
                case "error":
                    return exclamationButton;
                default:
                    return recordButton;
            }
        };

        useImperativeHandle(ref, () => ({
            stop,
        }));

        return (
            <div className={styles.container}>
                <div ref={waveformRef} className={styles.waveform}>
                    {state === "error" ?
                        <div className={styles.errorBar}>
                            A hangfelvétel nem elérhető. Lehetséges okok: {errorMessage}
                        </div>
                    :   bars.map((height, index) => (
                            <div key={index} className={styles.bar} style={{ height: `${height}px` }} />
                        ))
                    }
                </div>
                <button
                    className={`${styles.actionButton} ${state === "error" ? styles.errorActionButton : ""}`}
                    onClick={() => dispatch({ type: "toggle" })}
                >
                    <img src={getButtonIcon()} />
                </button>
            </div>
        );
    },
);
