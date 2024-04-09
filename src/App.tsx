import { BrowserRouter, Routes, Route } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes/index";

import { Fragment } from "react/jsx-runtime";
import { PrivateRoute } from "./routes/PrivateRoute";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const CurrentLayout =
              route.layout == null ? Fragment : route.layout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <CurrentLayout>
                    <Page />
                  </CurrentLayout>
                }
              ></Route>
            );
          })}

          {privateRoutes.map((route, index) => {
            const CurrentLayout =
              route.layout == null ? Fragment : route.layout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <CurrentLayout>
                    <PrivateRoute>
                      <Page />
                    </PrivateRoute>
                  </CurrentLayout>
                }
              ></Route>
            );
          })}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
