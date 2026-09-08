import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#f5f2e9',
        ink: '#292923',
        muted: '#626158',
        rule: '#d5d0c4',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.ink'),
            a: {
              color: theme('colors.ink'),
              '&:hover': {
                color: theme('colors.ink'),
              },
            },
            h1: {
              color: theme('colors.ink'),
              fontWeight: 'bold',
              fontSize: '2rem',
              marginBottom: '1rem',
            },
            h2: {
              color: theme('colors.ink'),
              fontSize: '1.5rem',
              marginBottom: '0.75rem',
            },
            h3: {
              color: theme('colors.ink'),
              fontSize: '1.25rem',
              marginBottom: '0.5rem',
            },
            p: {
              color: theme('colors.ink'),
              marginBottom: '1.25rem',
              lineHeight: '1.75',
            },
            img: {
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
            },
          },
        },
        lg: {
          css: {
            h1: {
              fontSize: '2.5rem',
            },
            h2: {
              fontSize: '2rem',
            },
            h3: {
              fontSize: '1.75rem',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;