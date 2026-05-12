// app/components/CTA.tsx
"use client";

export default function CTA() {
  const handleClick = () => {
    alert("Clicked!");
  };

  return (
    <div className="p-4">
      <button onClick={handleClick} className="bg-blue-500 text-white p-2 rounded">
        Click me
      </button>
    </div>
  );
}

