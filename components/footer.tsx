import Link from "next/link";
import { Instagram, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 w-full bg-zinc-900 text-zinc-200">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="text-2xl font-bold tracking-wide">
              STAY<span className="text-zinc-400">net</span>
            </div>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2">
              Contactos
            </h3>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>
                <a
                  className="hover:text-zinc-100 transition-colors"
                  href="mailto:geral@email.com"
                >
                  geral@email.com
                </a>
              </li>
              <li>
                <a
                  className="hover:text-zinc-100 transition-colors"
                  href="tel:+351967777777"
                >
                  +351 967 777 777
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <h3 className="text-sm font-semibold text-zinc-100 mb-2">
              Links Úteis
            </h3>
            <ul className="space-y-1 text-sm text-zinc-300">
              <li>
                <Link
                  className="hover:text-zinc-100 transition-colors"
                  href="/sign-in"
                >
                  Iniciar Sessão
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-zinc-100 transition-colors"
                  href="/sign-up"
                >
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-zinc-100 transition-colors"
                  href="/discover/partner"
                >
                  Torne-se um parceiro
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1 flex md:justify-end">
            <div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 md:text-right">
                Social
              </h3>
              <div className="flex gap-3 md:justify-end">
                <a
                  className="rounded-md p-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all"
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  className="rounded-md p-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-all"
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-4 text-center text-xs text-zinc-400">
          © {new Date().getFullYear()} StayNet. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
