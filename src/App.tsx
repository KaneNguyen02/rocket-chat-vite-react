import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes/index'

import { Fragment } from 'react/jsx-runtime'
import { PrivateRoute } from './routes/PrivateRoute'
import ServerProvider from './providers/ServerProvider'
import { Suspense } from 'react'
import { MessageProvider } from './providers/MessageProvider'

import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider, useTheme } from './providers/ThemeProvider'

function App() {
  return (
    <BrowserRouter>
      <ServerProvider>
        <ThemeProvider>
          <div className='App'>
            <Routes>
              {publicRoutes.map((route, index) => {
                const CurrentLayout = route.layout == null ? Fragment : route.layout
                const Page = route.component
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
                )
              })}

              {privateRoutes.map((route, index) => {
                const CurrentLayout = route.layout == null ? Fragment : route.layout
                const Page = route.component
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <CurrentLayout>
                        <Suspense
                          fallback={
                            <div className='flex h-screen justify-center items-center'>
                              <img src='./loading.svg' alt='loading' className='h-52' />
                            </div>
                          }
                        >
                          <PrivateRoute>
                            <MessageProvider>
                              <Page />
                            </MessageProvider>
                          </PrivateRoute>
                        </Suspense>
                        <ToastContainer
                          position='top-right'
                          autoClose={5000}
                          hideProgressBar={false}
                          newestOnTop={false}
                          closeOnClick
                          rtl={false}
                          pauseOnFocusLoss
                          draggable
                          pauseOnHover
                          theme='light'
                        />
                      </CurrentLayout>
                    }
                  ></Route>
                )
              })}
            </Routes>
          </div>
        </ThemeProvider>
      </ServerProvider>
    </BrowserRouter>
  )
}

export default App
