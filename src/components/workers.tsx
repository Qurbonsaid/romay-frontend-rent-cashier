import { Card, CardHeader, CardContent, CardFooter, CardTitle } from './ui/card'
import { PaginationComponent } from './pagination'
import { UserRound } from 'lucide-react'

type Worker = {
  id: string
  name: string
  position: string
  sells: string
}

const dummyWorkers: Worker[] = [
  {
    id: '1',
    name: 'John Doe',
    position: 'Manager',
    sells: '+320 ta sotuv',
  },
  {
    id: '2',
    name: 'Acme Inc',
    position: 'Manager',
    sells: '+320 ta sotuv',
  },
  {
    id: '3',
    name: 'Sarah Johnson',
    position: 'Manager',
    sells: '+150 ta mijoz',
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    position: 'Manager',
    sells: '+150 ta sotuv',
  },
  {
    id: '5',
    name: 'Sarah Johnson',
    position: 'Manager',
    sells: '+90 ta yangi mijoz',
  },
  {
    id: '6',
    name: 'Sarah Johnson',
    position: 'Manager',
    sells: '+200 ta yangi mahsulot qabul qilindi',
  },
]

export default function Workers({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[24px] font-semibold text-[#09090B]">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="w-full">
            <div className="flex flex-col gap-2">
              {dummyWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="text-sm flex justify-between items-center"
                >
                  <div className="flex items-center gap-4 bg-[#F9F9F9]">
                    <UserRound size={24} />
                    <div className="flex flex-col">
                      <div className="whitespace-nowrap text-[14px] text-[#09090B] font-medium">
                        {worker.name}
                      </div>
                      <div className="whitespace-nowrap text-[12px] text-[#71717A] ">
                        {worker.position}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-4 whitespace-nowrap text-[16px] font-medium text-green-600">
                    {worker.sells}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <PaginationComponent />
      </CardFooter>
    </Card>
  )
}
