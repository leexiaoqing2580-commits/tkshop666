const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main(){
  console.log('Seeding admin user...');
  await prisma.user.create({
    data: { email: 'admin@tkshop.com', password: 'Admin123!', name: 'Admin', role: 'admin' }
  });
  console.log('Seeding 2000 products...');
  const items = [];
  for(let i=1;i<=2000;i++){
    items.push({
      title: `Product #${i}`,
      description: `Description for product #${i}`,
      price: Math.round((Math.random()*200+1)*100)/100,
      image: `https://picsum.photos/seed/tk-${i}/800/600`,
      category: ['Electronics','Clothing','Home','Beauty','Sports','Toys'][i%6]
    });
    if(items.length>=200) { await prisma.product.createMany({ data: items }); items.length=0; console.log('batch inserted'); }
  }
  if(items.length) await prisma.product.createMany({ data: items });
  console.log('Done seeding.');
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect());
