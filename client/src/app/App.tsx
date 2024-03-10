import './App.css';
import { index } from '@/app/store';
import { Provider as StoreProvider } from 'react-redux';
import { DefaultLayout } from '@/app/layouts/default/DefaultLayout';

function App() {
    return (<StoreProvider store={index}>
        <DefaultLayout />
    </StoreProvider>);
}

export default App;
