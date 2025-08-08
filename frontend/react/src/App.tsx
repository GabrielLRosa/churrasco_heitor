import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ListCheckList, CreateCheckList } from './ui/pages';
import { ChecklistProvider } from './ui/contexts';

function App() {
  return (
    <ChecklistProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/checklist/new" element={<CreateCheckList />} />
            <Route path="/checklist/list" element={<ListCheckList /> }/>
            <Route path="/" element={<ListCheckList /> }/>
          </Routes>
        </BrowserRouter>
    </ChecklistProvider>
  );
}

export default App;
