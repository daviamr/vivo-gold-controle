import axios from 'axios';

export const viaCepApi = axios.create({
  baseURL: 'https://viacep.com.br/ws',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})

export const api = axios.create({
  baseURL: 'https://evolution.bigdates.com.br:3620/',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})