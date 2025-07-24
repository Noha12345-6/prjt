import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Routing";
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './component/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;