import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Button,
  Hr,
} from "@react-email/components";
interface VerifyEmailProps {
  fullName: string;
  verificationUrl: string;
}
export const VerifyEmailTemplate = ({
  fullName,
  verificationUrl,
}: VerifyEmailProps) => {
  return (
    <Html lang="pt" dir="ltr">
      {" "}
      <Head />{" "}
      <Preview>
        Verifique o seu email para ativar a sua conta StayNet
      </Preview>{" "}
      <Tailwind>
        {" "}
        <Body className="bg-gray-50 font-sans py-12">
          {" "}
          <Container className="bg-white rounded-lg max-w-[600px] mx-auto p-8 shadow-lg">
            {" "}
            <Section className="text-center mb-8">
              {" "}
              <Heading className="text-3xl font-bold text-gray-900 m-0 mb-4">
                {" "}
                Bem-vindo ao StayNet!{" "}
              </Heading>{" "}
              <Text className="text-lg text-gray-600 m-0">
                {" "}
                Olá {fullName}, estamos quase lá!{" "}
              </Text>{" "}
            </Section>{" "}
            <Hr className="border-gray-200 my-6" />{" "}
            <Section className="mb-8">
              {" "}
              <Text className="text-base text-gray-700 mb-4 leading-relaxed">
                {" "}
                Obrigado por se registar na StayNet. Para completar o seu
                registo e começar a reservar os melhores hotéis, clique no botão
                abaixo:{" "}
              </Text>{" "}
              <Section className="text-center my-8">
                {" "}
                <Button
                  href={verificationUrl}
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-base no-underline inline-block"
                >
                  {" "}
                  Verificar Email{" "}
                </Button>{" "}
              </Section>{" "}
              <Text className="text-sm text-gray-600 mb-4">
                {" "}
                Ou copie este link:{" "}
              </Text>{" "}
              <Text className="text-sm text-blue-600 break-all bg-gray-50 p-3 rounded">
                {" "}
                {verificationUrl}{" "}
              </Text>{" "}
            </Section>{" "}
            <Hr className="border-gray-200 my-6" />{" "}
            <Section className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              {" "}
              <Text className="text-sm text-amber-800 m-0 mb-2">
                {" "}
                <strong>Importante:</strong>{" "}
              </Text>{" "}
              <Text className="text-sm text-amber-700 m-0">
                {" "}
                Este link expira em <strong>24 horas</strong>.{" "}
              </Text>{" "}
            </Section>{" "}
            <Hr className="border-gray-200 my-6" />{" "}
            <Section>
              {" "}
              <Text className="text-xs text-gray-500 text-center m-0">
                {" "}
                © StayNet. Todos os direitos reservados.{" "}
              </Text>{" "}
            </Section>{" "}
          </Container>{" "}
        </Body>{" "}
      </Tailwind>{" "}
    </Html>
  );
};
export default VerifyEmailTemplate;
