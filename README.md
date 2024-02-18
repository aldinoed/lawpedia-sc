### HOW TO RUN LAWSITES MAIN SERVER

This repository contains an Angular project integrated with Firebase for backend services. The project aims to [provide a brief description of the project and its purpose].

#### Installation

1. **Clone Repository**: 
   ```
   git clone https://github.com/aldinoed/lawpedia-sc.git
   ```
2. **Navigate to Project Directory**: 
   ```
   cd lawpedia-sc
   ```
3. **Install Dependencies**: 
   ```
   npm install
   ```

#### Running the Application

- Run the following command for a dev server: 
  ```
  ng serve
  ```
- Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

---

### HOW TO RUN LAWSITES AI SERVER

This repository contains a FastAPI Python server project.

#### Installation

1. **Clone Repository**: 
   ```
   git clone https://github.com/khanzafa/lawbot.git
   ```
2. **Navigate to Project Directory**: 
   ```
   cd lawbot
   ```
3. **Create Virtual Environment**: 
   ```
   python -m venv venv
   ```
4. **Activate Virtual Environment**:

   - On Windows: 
     ```
     venv\Scripts\activate
     ```
   - On macOS and Linux: 
     ```
     source venv/bin/activate
     ```
5. **Install Dependencies**: 
   ```
   pip install -r requirements.txt
   ```

#### Running the Server

- Run the FastAPI server using the following command:
  ```
  uvicorn app:app --reload --port=1000
  ```
- The server will start locally at `http://127.0.0.1:1000/`.

#### API Documentation

- Access the Swagger documentation for the API at `http://127.0.0.1:1000/docs`.

---