#!/bin/bash
# Script para ejecutar migraciones Prisma después del despliegue en AWS EB
cd /var/app/current

echo "📦 Generando cliente Prisma..."
npx prisma generate

echo "🔄 Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

echo "✅ Migraciones ejecutadas correctamente"
