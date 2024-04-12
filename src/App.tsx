import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { privateRoutes, publicRoutes } from './routes/index'

import { Fragment } from 'react/jsx-runtime'
import { PrivateRoute } from './routes/PrivateRoute'
import ServerProvider from './providers/ServerProvider'
import { Suspense } from 'react'
import SubscriptionProvider from './providers/SubscriptionProvider'
import { MessageProvider } from './contexts/MessageContext'

function App() {
  return (
    <BrowserRouter>
      <ServerProvider>
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
                      <Suspense fallback={<div>Loading...</div>}>
                        <PrivateRoute>
                          <MessageProvider>
                            <Page />
                          </MessageProvider>
                        </PrivateRoute>
                      </Suspense>
                    </CurrentLayout>
                  }
                ></Route>
              )
            })}
          </Routes>
        </div>
      </ServerProvider>
    </BrowserRouter>
  )
}

export default App
