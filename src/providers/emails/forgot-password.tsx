import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Text,
  Font,
} from '@react-email/components';
import * as React from 'react';
import { Tailwind } from '@react-email/tailwind';

import { env } from '@/env';

interface ForgotPasswordEmailProps {
  name: string;
  token: string;
}

export function ForgotPasswordEmail({ name, token }: ForgotPasswordEmailProps) {
  const recoverLink = env.URL_FRONTEND + '/reset-password/' + token;
  return (
    <Tailwind
      config={{
        theme: {
          fontFamily: {
            'work-sans': [
              'Work Sans',
              '-apple-system',
              'BlinkMacSystemFont',
              'Segoe UI',
              'Roboto',
              'Helvetica Neue',
              'Ubuntu',
              'sans-serif',
            ],
          },
          colors: {
            white: '#FFFFFF',
            black: '#0C0E0F',
            gray: {
              100: '#F9FAFB',
              200: '#E5E7EB',
              400: '#9CA3AF',
            },
            esmerald: {
              500: '#66C6BA',
            },

            slate: {
              700: '#334155',
            },
          },
          fontSize: {
            'display-1': [
              '5.5rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'display-2': [
              '4.5rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'display-3': [
              '3.5rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'heading-1': [
              '3rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'heading-2': [
              '2.5rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'heading-3': [
              '2rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'title-medium': [
              '1.625rem',
              {
                lineHeight: '150%',
                fontWeight: 500,
                letterSpacing: '0px',
              },
            ],
            'title-semibold': [
              '1.625rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'subtitle-regular': [
              '1.375rem',
              {
                lineHeight: '150%',
                fontWeight: 400,
                letterSpacing: '0px',
              },
            ],
            'subtitle-medium': [
              '1.375rem',
              {
                lineHeight: '150%',
                fontWeight: 500,
                letterSpacing: '0px',
              },
            ],
            'subtitle-semibold': [
              '1.375rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'body-1-regular': [
              '1.125rem',
              {
                lineHeight: '150%',
                fontWeight: 400,
                letterSpacing: '0px',
              },
            ],
            'body-1-medium': [
              '1.125rem',
              {
                lineHeight: '150%',
                fontWeight: 500,
                letterSpacing: '0px',
              },
            ],
            'body-1-semibold': [
              '1.125rem',
              {
                lineHeight: '130%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'body-2-regular': [
              '1rem',
              {
                lineHeight: '150%',
                fontWeight: 400,
                letterSpacing: '0px',
              },
            ],
            'body-2-medium': [
              '1rem',
              {
                lineHeight: '150%',
                fontWeight: 500,
                letterSpacing: '0px',
              },
            ],
            'body-2-semibold': [
              '1rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'body-3-regular': [
              '0.875rem',
              {
                lineHeight: '150%',
                fontWeight: 400,
                letterSpacing: '0px',
              },
            ],
            'body-3-medium': [
              '0.875rem',
              {
                lineHeight: '150%',
                fontWeight: 500,
                letterSpacing: '0px',
              },
            ],
            'body-3-semibold': [
              '0.875rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
            'small-regular': [
              '0.75rem',
              {
                lineHeight: '150%',
                fontWeight: 400,
                letterSpacing: '0px',
              },
            ],
            'small-medium': [
              '0.75rem',
              {
                lineHeight: '150%',
                fontWeight: 500,
                letterSpacing: '0px',
              },
            ],
            'small-semibold': [
              '0.75rem',
              {
                lineHeight: '150%',
                fontWeight: 600,
                letterSpacing: '0px',
              },
            ],
          },
        },
      }}
    >
      <Html>
        <Head>
          <Font
            fontFamily='Work Sans'
            fallbackFontFamily='Verdana'
            webFont={{
              url: 'https://fonts.gstatic.com/s/worksans/v18/QGYsz_wNahGAdqQ43Rh_fKDp.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle='normal'
          />
          <Font
            fontFamily='Work Sans'
            fallbackFontFamily='Verdana'
            webFont={{
              url: 'https://fonts.gstatic.com/s/worksans/v18/QGYsz_wNahGAdqQ43Rh_fKDp.woff2',
              format: 'woff2',
            }}
            fontWeight={500}
            fontStyle='normal'
          />
        </Head>

        <Body className='bg-gray-100 p-14 font-work-sans'>
          <Container className='bg-white p-14 mt-10 rounded-lg border-gray-400/40 border border-solid'>
            <Section>
              <Section className='text-center h-9'>
                <img
                  src='https://photolink.vercel.app/assets/logo.png'
                  alt='logo'
                />
              </Section>
              <Text className='text-subtitle-regular text-slate-700 text-center'>
                Redefinição de senha
              </Text>
              <Text className='text-small-regular text-gray-400 text-center'>
                Olá <span className='text-slate-700'>{name}</span>, para trocar
                sua senha, clique no botão abaixo e defina uma nova senha para
                acessar sua conta.
              </Text>
              <Button
                className='bg-esmerald-500 mx-auto block w-fit py-[10px] px-5 rounded-lg text-white'
                href={recoverLink}
              >
                {' '}
                Redefinir senha
              </Button>
              <Text className='text-small-regular text-gray-400 text-center'>
                Caso não consiga acessar pelo botão, copie e cole o link abaixo
                em seu navegador:
              </Text>
              <Text className='text-small-regular text-esmerald-500 text-center w-full mx-auto block'>
                {recoverLink}
              </Text>
              <Hr className='mt-4' />
              <Text className='text-body-2-regular text-slate-700 text-center '>
                Equipe PhotoLink
              </Text>
              <Text className='text-small-regular text-gray-400 text-center'>
                Caso não tenha solicitado, desconsidere esta mensagem.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
