import { useGetRole } from './hooks/use-get-role'
import { MainLayout } from './layouts/MainLayout'
import { AppRouter } from './router'

function App() {
  const role = useGetRole()
  console.log(role)
  return (
    <MainLayout>
      <AppRouter />
    </MainLayout>
  )
}

export default App
