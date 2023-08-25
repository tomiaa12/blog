import type { VercelRequest, VercelResponse } from '@vercel/node';
 
export default function (request: VercelRequest, response: VercelResponse) {
  const { name = 'World' } = request.query;
  response.send(`Hello ${name}!`);
}