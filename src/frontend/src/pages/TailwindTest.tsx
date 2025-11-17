import React from "react";

export function TailwindTest() {
  return (
    <div className="p-8">
      <div className="max-w-md mx-auto bg-white/10 backdrop-blur rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="md:flex">
          <div className="p-8">
            <h1 className="uppercase tracking-wide text-sm text-agendou-primary font-semibold">
              Tailwind Test
            </h1>
            <p className="mt-2 text-white">
              Se você vê este cartão estilizado, Tailwind está funcionando.
            </p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-agendou-primary text-black rounded hover:opacity-90">
                Teste
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
