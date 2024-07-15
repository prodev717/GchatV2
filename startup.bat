@echo off
cd backend
start cmd /k uvicorn main:app
cd ..
cd frontend
start cmd /k npm run dev
cd ..
end