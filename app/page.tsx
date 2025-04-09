import PixelCard from '../components/PixelCard';

export default function Home() {
  // 第一行：Gemini, ChatGPT, Claude
  // 第二行：Grok, DeepSeek, Qwen
  const modelLogos = [
    { name: "Gemini", path: "/gemini-color.svg" },
    { name: "ChatGPT", path: "/openai.svg" },
    { name: "Claude", path: "/claude-color.svg" },
    { name: "Grok", path: "/grok.svg" },
    { name: "DeepSeek", path: "/deepseek-color.svg" },
    { name: "Qwen", path: "/qwen-color.svg" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {modelLogos.map((logo) => (
        <PixelCard key={logo.name} variant="pink" className="relative">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img
              src={logo.path}
              alt={`${logo.name} Logo`}
              className="w-16 h-16"
            />
            <span className="mt-2 text-sm">{logo.name}</span>
          </div>
        </PixelCard>
      ))}
    </div>
  );
}