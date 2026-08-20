import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { LanguageCode } from "@/lib/dto/language-code";

const translations = {
  "en-US": {
    preview: (name: string) =>
      `New message from ${name} — portfolio contact form`,
    label: "PORTFOLIO / CONTACT",
    title: "New message.",
    from: "From",
    message: "Message",
    reply: (name: string) =>
      `Reply directly to this email to respond to ${name}.`,
    footer: "MUHAMMED SHABAN — PORTFOLIO",
  },
  "ar-EG": {
    preview: (name: string) => `رسالة جديدة من ${name} — نموذج التواصل`,
    label: "الموقع الشخصي / تواصل",
    title: "رسالة جديدة",
    from: "من",
    message: "الرسالة",
    reply: (name: string) =>
      `يمكنك الرد مباشرةً على هذا البريد للرد على ${name}.`,
    footer: "محمد شعبان — الموقع الشخصي",
  },
} as const;

type ContactEmailProps = {
  fullName: string;
  email: string;
  content: string;
  locale: LanguageCode;
};

export function ContactEmail({
  fullName,
  email,
  content,
  locale,
}: ContactEmailProps) {
  const t = translations[locale];
  const isArabic = locale === LanguageCode["ar-EG"];

  return (
    <Html lang={locale} dir={isArabic ? "rtl" : "ltr"}>
      <Head />
      <Preview>{t.preview(fullName)}</Preview>

      <Body
        style={{
          margin: 0,
          padding: "40px 20px",
          backgroundColor: "#f4f0e8",
          fontFamily: "Arial, Helvetica, sans-serif",
          color: "#111111",
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        <Container
          style={{
            maxWidth: "620px",
            margin: "0 auto",
          }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              border: "3px solid #111111",
              boxShadow: isArabic ? "-8px 8px 0 #111111" : "8px 8px 0 #111111",
              padding: "32px",
              textAlign: isArabic ? "right" : "left",
            }}
          >
            <Text
              style={{
                margin: "0 0 12px",
                fontSize: "13px",
                fontWeight: 800,
                letterSpacing: isArabic ? "0" : "2px",
              }}
            >
              {t.label}
            </Text>

            <Heading
              style={{
                margin: 0,
                fontSize: "36px",
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: isArabic ? "0" : "-1px",
              }}
            >
              {t.title}
            </Heading>

            <Hr
              style={{
                margin: "28px 0",
                border: 0,
                borderTop: "3px solid #111111",
              }}
            />

            <Section
              style={{
                border: "3px solid #111111",
                padding: "18px",
                marginBottom: "20px",
              }}
            >
              <Text
                style={{
                  margin: "0 0 6px",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {t.from}
              </Text>

              <Text
                style={{
                  margin: 0,
                  fontSize: "18px",
                  fontWeight: 700,
                }}
              >
                {fullName}
              </Text>

              <Text
                style={{
                  margin: "4px 0 0",
                  fontSize: "14px",
                  direction: "ltr",
                  textAlign: isArabic ? "right" : "left",
                }}
              >
                {email}
              </Text>
            </Section>

            <Section
              style={{
                border: "3px solid #111111",
                padding: "20px",
                backgroundColor: "#fff36a",
              }}
            >
              <Text
                style={{
                  margin: "0 0 10px",
                  fontSize: "12px",
                  fontWeight: 800,
                }}
              >
                {t.message}
              </Text>

              <Text
                style={{
                  margin: 0,
                  fontSize: "16px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}
              >
                {content}
              </Text>
            </Section>

            <Section
              style={{
                marginTop: "28px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                {t.reply(fullName)}
              </Text>
            </Section>
          </Section>

          <Text
            style={{
              margin: "24px 0 0",
              textAlign: "center",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: isArabic ? "0" : "1px",
            }}
          >
            {t.footer}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
