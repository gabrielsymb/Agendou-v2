import { generateToken } from '../utils/jwt';

// Token para o prestador criado pelo seed: prestador-seed-1
const payload = {
  id: 'prestador-seed-1',
  prestadorId: 'prestador-seed-1',
  email: 'seed@local.test',
};

const token = generateToken(payload as any);
console.log(token);
