import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Ejecutando seed...');

  // Crear usuarios
  const passwordHash = await bcrypt.hash('password123', 10);

  const estudiante1 = await prisma.usuario.upsert({
    where: { email: 'ana@correo.com' },
    update: {},
    create: {
      email: 'ana@correo.com',
      password: passwordHash,
      nombre: 'Ana García',
      rol: Rol.estudiante,
    },
  });

  const estudiante2 = await prisma.usuario.upsert({
    where: { email: 'carlos@correo.com' },
    update: {},
    create: {
      email: 'carlos@correo.com',
      password: passwordHash,
      nombre: 'Carlos López',
      rol: Rol.estudiante,
    },
  });

  const tutorUser1 = await prisma.usuario.upsert({
    where: { email: 'maria@correo.com' },
    update: {},
    create: {
      email: 'maria@correo.com',
      password: passwordHash,
      nombre: 'María Rodríguez',
      rol: Rol.tutor,
    },
  });

  const tutorUser2 = await prisma.usuario.upsert({
    where: { email: 'pedro@correo.com' },
    update: {},
    create: {
      email: 'pedro@correo.com',
      password: passwordHash,
      nombre: 'Pedro Martínez',
      rol: Rol.tutor,
    },
  });

  // Crear perfiles de tutor
  const tutor1 = await prisma.tutor.upsert({
    where: { id: tutorUser1.id },
    update: {},
    create: {
      id: tutorUser1.id,
      materias: ['Matemáticas', 'Cálculo', 'Álgebra'],
      tarifaHora: 25.00,
      biografia: 'Profesora de matemáticas con 10 años de experiencia.',
    },
  });

  const tutor2 = await prisma.tutor.upsert({
    where: { id: tutorUser2.id },
    update: {},
    create: {
      id: tutorUser2.id,
      materias: ['Programación', 'Base de Datos', 'Algoritmos'],
      tarifaHora: 30.00,
      biografia: 'Ingeniero de software con amplia experiencia en desarrollo.',
    },
  });

  // Crear disponibilidades (Lunes a Viernes, 8:00-17:00)
  for (let dia = 1; dia <= 5; dia++) {
    await prisma.disponibilidad.create({
      data: {
        tutorId: tutor1.id,
        diaSemana: dia,
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
      },
    });
    await prisma.disponibilidad.create({
      data: {
        tutorId: tutor1.id,
        diaSemana: dia,
        horaInicio: '14:00',
        horaFin: '17:00',
        activo: true,
      },
    });
    await prisma.disponibilidad.create({
      data: {
        tutorId: tutor2.id,
        diaSemana: dia,
        horaInicio: '09:00',
        horaFin: '13:00',
        activo: true,
      },
    });
    await prisma.disponibilidad.create({
      data: {
        tutorId: tutor2.id,
        diaSemana: dia,
        horaInicio: '15:00',
        horaFin: '18:00',
        activo: true,
      },
    });
  }

  console.log('✅ Seed completado');
  console.log({
    estudiantes: [estudiante1.email, estudiante2.email],
    tutores: [tutorUser1.email, tutorUser2.email],
  });
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
