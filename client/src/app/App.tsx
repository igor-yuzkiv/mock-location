import './App.css';
import { store } from '@/app/store';
import { Provider as StoreProvider } from 'react-redux';
import { DefaultLayout } from '@/app/layouts/default/DefaultLayout';

function App() {
    return (<StoreProvider store={store}>
        <DefaultLayout />
    </StoreProvider>);
}

export default App;
