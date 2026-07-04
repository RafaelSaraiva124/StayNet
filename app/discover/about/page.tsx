import React from "react";

const Page = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl text-center mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6 text-center">Quem Somos</h1>

        <p className="text-lg leading-relaxed mb-6">
          A StayNet nasceu com a missão de tornar a experiência de reservas e
          gestão de hotéis mais simples e eficiente.
        </p>

        <p className="text-lg leading-relaxed mb-6">
          A nossa plataforma centraliza todas as operações num único sistema
          intuitivo, oferecendo uma experiência fluida tanto para quem gere
          hotéis como para quem reserva. Com a StayNet, a gestão e a reserva de
          quartos tornam-se rápidas, claras e descomplicadas.
        </p>

        <p className="text-lg leading-relaxed">
          O nosso objetivo é conectar hotéis e hóspedes de forma inteligente,
          garantindo eficiência, transparência e satisfação em cada interação.
        </p>
      </div>
    </div>
  );
};
export default Page;
