import React, { useRef, useState, useEffect } from 'react';
import { cn } from './utils';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    className?: string;
    inputClassName?: string;
    disabled?: boolean;
}

export function OTPInput({ length = 6, onComplete, className, inputClassName, disabled = false }: OTPInputProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        // Allow only last entered character
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Trigger completion callback
        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
        }

        // Move to next input if value is entered
        if (value && index < length - 1 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            // Move to previous input on backspace if current is empty
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, length);

        if (!/^\d+$/.test(pastedData)) return; // Only allow numbers

        const newOtp = [...otp];
        pastedData.split("").forEach((char, index) => {
            if (index < length) newOtp[index] = char;
        });
        setOtp(newOtp);

        const combinedOtp = newOtp.join("");
        if (combinedOtp.length === length) {
            onComplete(combinedOtp);
        }

        // Focus the box after the last pasted character
        const nextIndex = Math.min(pastedData.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
    };

    return (
        <div className={cn("flex gap-2 justify-center", className)}>
            {otp.map((digit, index) => (
                <React.Fragment key={index}>
                    <input
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        className={cn(
                            "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-200 outline-none",
                            "bg-white/10 border-white/20 text-white placeholder-white/20",
                            "focus:border-[#FFB703] focus:bg-white/20 focus:text-[#FFB703] focus:shadow-lg focus:shadow-[#FFB703]/20",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            digit && "border-[#FFB703]/50 bg-white/15",
                            inputClassName
                        )}
                    />
                    {index === length / 2 - 1 && (
                        <div className="w-2 h-1 bg-white/20 self-center rounded-full mx-1" />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
