// tests/load-test-node.js
import axios from 'axios';
import { performance } from 'perf_hooks';

// 📌 Configuração
const BASE_URL = 'http://localhost:3001/api';
const CONCURRENT_USERS = 10;
const TOTAL_REQUESTS = 100;

// 📌 Gerar usuários de teste
function generateTestUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      name: `User ${i}`,
      email: `user_${i}_${Date.now()}@test.com`,
      password: 'Senha123!',
      height: 170 + Math.floor(Math.random() * 20),
      weight: 60 + Math.floor(Math.random() * 30),
      birthDate: '1990-01-01T00:00:00.000Z',
      gender: 'MALE',
      goal: 'WEIGHT_LOSS'
    });
  }
  return users;
}

// 📌 Função para registrar usuário
async function registerUser(user) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, user);
    return response.status === 201;
  } catch (error) {
    return false;
  }
}

// 📌 Função para fazer login
async function loginUser(email, password) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    if (response.status === 200) {
      return response.data.data.accessToken;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 📌 Função para criar refeição
async function createMeal(token) {
  try {
    const response = await axios.post(`${BASE_URL}/meals`, {
      name: `Refeição ${Date.now()}`,
      calories: Math.floor(Math.random() * 500) + 200,
      category: ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'][Math.floor(Math.random() * 4)]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.status === 201;
  } catch (error) {
    return false;
  }
}

// 📌 Função para obter dashboard
async function getDashboard(token) {
  try {
    const response = await axios.get(`${BASE_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

// 📌 Função principal de teste
async function runLoadTest() {
  console.log('🚀 Iniciando testes de carga...\n');
  
  const metrics = {
    registers: 0,
    logins: 0,
    meals: 0,
    dashboards: 0,
    errors: 0,
    totalTime: 0
  };

  const startTime = performance.now();

  // 1. Registrar usuários
  console.log('📝 Registrando usuários...');
  const users = generateTestUsers(CONCURRENT_USERS);
  
  const registerPromises = users.map(user => registerUser(user));
  const registerResults = await Promise.all(registerPromises);
  metrics.registers = registerResults.filter(r => r).length;
  
  console.log(`✅ ${metrics.registers}/${CONCURRENT_USERS} usuários registrados`);

  // 2. Fazer login
  console.log('🔐 Fazendo login...');
  const loginPromises = users.map(user => loginUser(user.email, user.password));
  const tokens = await Promise.all(loginPromises);
  metrics.logins = tokens.filter(t => t !== null).length;
  
  console.log(`✅ ${metrics.logins}/${CONCURRENT_USERS} logins bem-sucedidos`);

  // 3. Operações CRUD
  console.log('📊 Executando operações...');
  
  const validTokens = tokens.filter(t => t !== null);
  
  for (let i = 0; i < Math.min(validTokens.length, TOTAL_REQUESTS); i++) {
    const token = validTokens[i % validTokens.length];
    
    // Criar refeição
    const mealResult = await createMeal(token);
    if (mealResult) metrics.meals++;
    else metrics.errors++;

    // Obter dashboard
    const dashboardResult = await getDashboard(token);
    if (dashboardResult) metrics.dashboards++;
    else metrics.errors++;

    // Pequeno delay para não sobrecarregar
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const endTime = performance.now();
  metrics.totalTime = (endTime - startTime) / 1000; // em segundos

  // 📊 Relatório
  console.log('\n📊 ===== RELATÓRIO DE TESTES =====');
  console.log(`⏱️ Tempo total: ${metrics.totalTime.toFixed(2)}s`);
  console.log(`📝 Registros: ${metrics.registers}/${CONCURRENT_USERS}`);
  console.log(`🔐 Logins: ${metrics.logins}/${CONCURRENT_USERS}`);
  console.log(`🍽️ Refeições criadas: ${metrics.meals}`);
  console.log(`📊 Dashboards acessados: ${metrics.dashboards}`);
  console.log(`❌ Erros: ${metrics.errors}`);
  
  const totalOps = metrics.meals + metrics.dashboards;
  const successRate = ((totalOps - metrics.errors) / totalOps * 100).toFixed(2);
  console.log(`📈 Taxa de sucesso: ${successRate}%`);
  console.log(`⚡ Requisições por segundo: ${(totalOps / metrics.totalTime).toFixed(2)} req/s`);
}

// 📌 Executar
console.log('🧪 Testes de Carga - SempreFit');
console.log(`👥 Usuários simultâneos: ${CONCURRENT_USERS}`);
console.log(`📝 Total de requisições: ${TOTAL_REQUESTS}\n`);

runLoadTest().catch(console.error);