import React from "react";
import Image from "next/image";
import { Hotel, Zap, Medal } from "lucide-react";
import Link from "next/link";
import { HotelCard } from "@/components/hotels/hotelcard";
import { getHotels } from "@/lib/actions/hotel.action";

export default async function Page() {
  const hotels = await getHotels();

  return (
    <div>
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 lg:p-12 gap-8 max-w-7xl mx-auto">
        <div className="max-w-2xl text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
            Explora as melhores estadias na StayNet
          </h1>
          <p className="mt-4 text-muted-foreground text-base md:text-lg">
            A forma mais simples e rápida de encontrares a tua próxima estadia.
          </p>
        </div>

        <div className="hidden md:block flex-shrink-0">
          <Image
            src="/header-image.svg"
            alt="Header Image"
            width={600}
            height={400}
            className="object-contain w-full h-auto"
          />
        </div>
      </header>

      <section id="features" className="bg-secondary py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-left mb-12">
            Porque escolher a StayNet?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[var(--brand)/15] text-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                <Hotel />
              </div>
              <h3 className="text-xl font-bold mb-2">Variedade de Opções</h3>
              <p className="text-muted-foreground">
                Milhares de Hotéis verificados em todo o mundo.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[var(--brand)/15] text-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                <Zap />
              </div>
              <h3 className="text-xl font-bold mb-2">Reserva Rápida</h3>
              <p className="text-muted-foreground">
                Processo de reserva simples e seguro. Confirma a tua estadia em
                poucos minutos.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[var(--brand)/15] text-[var(--brand)] rounded-xl flex items-center justify-center mb-4">
                <Medal />
              </div>
              <h3 className="text-xl font-bold mb-2">Melhor Preço Garantido</h3>
              <p className="text-muted-foreground">
                Preços competitivos e transparentes. Sem taxas escondidas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="aboutus" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-left mb-12">
            Sobre Nós
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl">
            A StayNet nasceu da vontade de simplificar a forma como hotéis e
            hóspedes interagem. Acreditamos que a tecnologia deve tornar o
            processo de reserva e gestão mais rápido, eficiente e humano. A
            nossa plataforma foi desenvolvida para oferecer uma experiência
            fluida — tanto para quem gere hotéis como para quem reserva —
            centralizando todas as operações num único sistema intuitivo.
          </p>
        </div>
      </section>

      <section id="hotels" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-left">
            Descobre os nossos hotéis
          </h2>

          <div className="flex flex-wrap gap-6">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex-1 min-w-[280px] max-w-[320px]"
              >
                <HotelCard hotel={hotel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="partners"
        className="bg-[var(--brand)] py-16 px-6 text-white"
      >
        <div className="flex flex-col md:flex-row items-start gap-8 max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold flex-shrink-0 md:max-w-md">
            Como posso ser Parceiro da StayNet?
          </h2>

          <div className="flex flex-col">
            <p className="text-white/90 text-base md:text-lg mb-8 leading-relaxed">
              Se tens um hotel, podes juntar-te à StayNet e começar a receber
              reservas de forma simples, rápida e segura. Basta preencher um
              pequeno formulário e a nossa equipa entrará em contacto para
              ativar a tua conta.
            </p>

            <Link href="/partner">
              <button className="px-8 py-4 bg-[var(--brand2)] rounded-xl hover:bg-[var(--brandhover2)] transition font-bold text-lg self-start">
                Começar Agora
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
