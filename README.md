# nexplore
**Introduction:**
Todo app that support create, list, update, delete operation

**requirement**
1. react
2. docker(for DB)

**Port use**
1. frontend: 3005
2. backend: 4000
3. testing postgresql DB: 5432
4. prod postgresql DB: 5433 

**Installation**
1. git pull from the repo
2. set up frontend project
```
cd frontend
npm install
```
3. set up backend project
```
cd backend
npm install
sh docker/setUpTestEnv/setupdb.sh
sh docker/setUpProdEnv/setupdb.sh
```

**Testing**
```
cd backend
npm test
```
<img width="810" alt="image" src="https://github.com/user-attachments/assets/79f2f1be-0778-4a81-8e2d-b4516941ea68">


**Execution**
<br/>
backend
```
cd backend
npm start
```
frontend
```
cd frontend
npm start
```

