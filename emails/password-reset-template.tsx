import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
  Tailwind,
} from "@react-email/components";

interface PasswordResetProps {
  resetUrl: string;
  expiresInMinutes: number;
}

export const PasswordResetEmail = ({
  resetUrl,
  expiresInMinutes,
}: PasswordResetProps) => {
  return (
    <Html lang="pt" dir="ltr">
      <Head />
      <Preview>Recupere a sua password da StayNet</Preview>
      <Tailwind>
        <Body className="bg-gray-50 font-sans py-12">
          <Container className="bg-white rounded-lg max-w-[600px] mx-auto p-8 shadow-lg">
            <Section className="text-center mb-8">
              <Heading className="text-3xl font-bold text-gray-900 m-0 mb-4">
                Recuperação de Password
              </Heading>
              <Text className="text-lg text-gray-600 m-0">
                Recebemos um pedido para redefinir a sua password
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Section className="mb-8">
              <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                Clique no botão abaixo para criar uma nova password:
              </Text>

              <Section className="text-center my-8">
                <Button
                  href={resetUrl}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-base no-underline inline-block"
                >
                  Redefinir Password
                </Button>
              </Section>

              <Text className="text-sm text-gray-600 mb-4 leading-relaxed">
                Ou copie e cole este link no seu navegador:
              </Text>
              <Text className="text-sm text-blue-600 break-all bg-gray-50 p-3 rounded">
                {resetUrl}
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />

            <Section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <Text className="text-sm text-amber-800 m-0 mb-2">
                <strong>Importante:</strong>
              </Text>
              <Text className="text-sm text-amber-700 m-0">
                Este link é válido por{" "}
                <strong>{expiresInMinutes} minutos</strong>.
              </Text>
            </Section>

            <Section className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <Text className="text-sm text-red-800 m-0 mb-2">
                <strong>Segurança:</strong>
              </Text>
              <Text className="text-sm text-red-700 m-0 mb-1">
                • Nunca partilhe este link com ninguém
              </Text>
            </Section>

            <Hr className="border-gray-200 my-6" />
            <Section>
              <Text className="text-xs text-gray-500 text-center m-0 mb-2">
                © StayNet. Todos os direitos reservados.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>{" "}
    </Html>
  );
};

export default PasswordResetEmail;
