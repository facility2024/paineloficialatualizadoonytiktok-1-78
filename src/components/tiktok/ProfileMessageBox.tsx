import React, { useMemo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Smile, Send } from "lucide-react";
import { toast } from "sonner";

interface ProfileMessageBoxProps {
  modelName: string;
  inputId?: string;
  onSend?: (message: string) => void | Promise<void>;
}

const EMOJIS = [
  "😀","😁","😂","🤣","😊","😍","😘","😎","😜","😉",
  "🥰","😅","😭","😢","😡","👍","🙏","🙌","🎉","🔥",
  "💖","✨","💋","💃","🕺","😏","😇","🤩","🤗","😴"
];

const MAX_LEN = 130;

// Regex for allowed single characters: letters, numbers, spaces, period, comma, and common emoji ranges
const singleCharAllowed = /[\p{L}\p{N}\s\.,\u{1F300}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

function sanitizeValue(value: string) {
  // Keep only allowed characters and enforce max length
  const cleaned = Array.from(value).filter((ch) => singleCharAllowed.test(ch)).join("");
  return cleaned.slice(0, MAX_LEN);
}

const ProfileMessageBox: React.FC<ProfileMessageBoxProps> = ({ modelName, inputId, onSend }) => {
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const remaining = useMemo(() => MAX_LEN - Array.from(value).length, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = sanitizeValue(e.target.value);
    setValue(next);
  };

  const insertAtCursor = (text: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const current = el.value;
    const nextRaw = current.slice(0, start) + text + current.slice(end);
    const next = sanitizeValue(nextRaw);
    setValue(next);
    // restore caret after React update
    requestAnimationFrame(() => {
      const caretPos = Math.min(start + text.length, next.length);
      el.setSelectionRange(caretPos, caretPos);
      el.focus();
    });
  };

  const handleSend = async () => {
    const message = value.trim();
    if (!message) return;
    try {
      await onSend?.(message);
      toast.success('Mensagem enviada!');
      setValue('');
    } catch (e) {
      console.error(e);
      toast.error('Não foi possível enviar a mensagem.');
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-3 mb-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Inserir emoji" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 px-3 py-2">
              <Smile className="w-4 h-4 mr-1" />
              <span className="text-xs">Emoji</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-2 bg-gray-800 border-gray-600 z-[10001] shadow-lg">
            <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  className="text-xl hover:bg-gray-700 rounded-md p-1 transition-colors duration-150 flex items-center justify-center h-8 w-8"
                  onClick={() => {
                    insertAtCursor(e);
                    setOpen(false);
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="text-xs text-gray-400">{MAX_LEN - remaining}/{MAX_LEN}</div>
        
        <Button
          type="button"
          size="sm"
          onClick={handleSend}
          disabled={!value.trim().length}
          aria-label="Enviar mensagem"
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:pointer-events-none px-4 py-2 font-medium"
        >
          <Send className="w-4 h-4 mr-1" />
          <span className="text-sm">Enviar</span>
        </Button>
      </div>
      <Textarea
        id={inputId}
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        maxLength={MAX_LEN}
        placeholder={`Envie uma mensagem para ${modelName}...`}
        aria-label={`Campo de mensagem para ${modelName}`}
        className="min-h-[72px] resize-y bg-gray-900 border-gray-600 text-white placeholder:text-gray-400 focus:border-gray-500 focus:ring-gray-500"
      />
      <div className="mt-1 text-right text-xs text-gray-400">
        {remaining >= 0 ? `${remaining} caracteres restantes` : ""}
      </div>
    </div>
  );
};

export default ProfileMessageBox;
