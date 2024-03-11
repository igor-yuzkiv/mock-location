import './App.css';
import { index } from '@/app/store';
import { Provider as StoreProvider } from 'react-redux';
import { DefaultLayout } from '@/app/layouts/default/DefaultLayout';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (<StoreProvider store={index}>
        <DefaultLayout />
        <ToastContainer style={{zIndex: 99}} position="top-center"/>
    </StoreProvider>);
}

export default App;
