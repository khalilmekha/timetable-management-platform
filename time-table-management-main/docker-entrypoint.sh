#!/bin/bash

echo "Running migrations..."
# Run migrations

if [ "$RESET_DB" = "1" ]; then
    echo "Reseting the database..."
    npm run prisma:reset
    if [ $? -ne 0 ]; then
        echo "Resetting the database failed. Exiting."
        exit 1
    fi
else
    echo "Skipping database reset as RESET_DB is not set to 1."
fi

npm run prisma:deploy
if [ $? -ne 0 ]; then
    echo "Migrations failed. Exiting."
    exit 1
fi

echo "Migrations completed successfully."

# Seeding the database

if [ "$SEED_DB" = "1" ]; then
    echo "Seeding the database..."
    npm run prisma:seed
    if [ $? -ne 0 ]; then
        echo "Seeding failed. Exiting."
        exit 1
    fi
else
    echo "Skipping seeding as SEED_DB is not set to 1."
fi

# starting studio on background
echo "Starting Prisma Studio in the background..."
npx prisma studio &

# Start the application

echo "Starting the application..."

npm run start
