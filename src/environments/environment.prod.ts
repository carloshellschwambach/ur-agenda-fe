/**
 * Configuração para build de produção.
 * Em deploy, substitua apiUrl pela URL da API (ex.: https://api.seudominio.com).
 * Alternativa: use variáveis de ambiente no processo de build (ex.: env no CI).
 */
export const environment = {
  production: true,
  apiUrl: 'https://sua-api.example.com'
};
