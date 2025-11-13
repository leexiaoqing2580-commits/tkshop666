const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(bodyParser.json());

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

// health
app.get('/api/health', (req,res)=>res.json({ok:true}));

// auth - register/login (demo, password stored as hashed)
app.post('/api/auth/register', async (req,res)=>{
  const { email, password, name } = req.body;
  if(!email||!password) return res.status(400).json({ error: 'missing' });
  const hashed = bcrypt.hashSync(password, 8);
  try{
    const u = await prisma.user.create({ data: { email, password: hashed, name } });
    const token = jwt.sign({ id: u.id, role: u.role }, JWT_SECRET);
    res.json({ token, user: { id: u.id, email: u.email, name: u.name, role: u.role } });
  }catch(e){ res.status(400).json({ error: 'exists' }); }
});

app.post('/api/auth/login', async (req,res)=>{
  const { email, password } = req.body;
  const u = await prisma.user.findUnique({ where: { email } });
  if(!u) return res.status(401).json({ error: 'invalid' });
  const ok = bcrypt.compareSync(password, u.password);
  if(!ok) return res.status(401).json({ error: 'invalid' });
  const token = jwt.sign({ id: u.id, role: u.role }, JWT_SECRET);
  res.json({ token, user: { id: u.id, email: u.email, name: u.name, role: u.role } });
});

// products list + detail
app.get('/api/products', async (req,res)=>{
  const page = parseInt(req.query.page||'1'); 
  const per = parseInt(req.query.per||'24');
  const skip = (page-1)*per;
  const total = await prisma.product.count();
  const items = await prisma.product.findMany({ skip, take: per, orderBy: { id: 'asc' } });
  res.json({ total, items });
});

app.get('/api/products/:id', async (req,res)=>{
  const id = parseInt(req.params.id);
  const p = await prisma.product.findUnique({ where: { id } });
  if(!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

// orders (create)
app.post('/api/orders', async (req,res)=>{
  const { token, items, total } = req.body;
  let userId = null;
  try { if(token) { const data = jwt.verify(token, JWT_SECRET); userId = data.id; } } catch(e){}
  const o = await prisma.order.create({ data: { userId: userId||0, total: total||0, items: JSON.stringify(items||[]) } });
  res.json(o);
});

// fake payments
app.post('/api/payments/create', async (req,res)=>{
  const { currency, amount } = req.body;
  const id = uuidv4();
  await prisma.payment.create({ data: { id, method: 'crypto', currency, amount, status: 'pending' } });
  res.json({ id, paymentUrl: `https://fake-pay.local/pay/${id}`, status: 'pending' });
});

app.get('/api/payments/:id', async (req,res)=>{
  const id = req.params.id;
  const p = await prisma.payment.findUnique({ where: { id } });
  if(!p) return res.status(404).json({ error: 'not found' });
  res.json(p);
});

// ✅ 关键：不要 listen，而是导出 handler
module.exports = app;

