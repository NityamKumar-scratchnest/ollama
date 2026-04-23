// src/components/Header.tsx
const Header = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-black">
      <div className="flex gap-2">
        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
      </div>

      <span className="text-green-400 text-sm terminal-glow">
        ⚡ AI Command Center
      </span>
    </div>
  );
};

export default Header;