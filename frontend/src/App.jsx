import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/Sidebar.jsx";
import SingleImage from "./pages/SingleImage.jsx";
import MultipleImages from "./pages/MultipleImages.jsx";
import MultipleImageWithFields from "./pages/MultipleImageWithFields.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />

        <main className="flex-1 bg-gray-100">
          <Routes>

            <Route path="/single-image" element={<SingleImage />} />

            <Route
              path="/multiple-images"
              element={<MultipleImages />}
            />

            <Route
              path="/multiple-images-fields"
              element={<MultipleImageWithFields />}
            />

          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;