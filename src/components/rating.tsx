import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { PaginationComponent } from './pagination'

type Transaction = {
  id: string
  buyer: string
  phone: string
  amount: number
}

const dummyTransactions: Transaction[] = [
  {
    id: '1',
    buyer: 'John Doe',
    amount: 1250.75,
    phone: '+998 99 777 77 77',
  },
  {
    id: '2',
    buyer: 'Acme Inc',
    amount: 3200.5,
    phone: '+998 99 888 88 88',
  },
  {
    id: '3',
    buyer: 'Sarah Johnson',
    amount: 750.25,
    phone: '+998 99 999 99 99',
  },
]

export default function Rating({
  title,
  description,
  transactions = dummyTransactions,
  showPagination = true,
}: {
  title: string
  description: string
  transactions?: Transaction[]
  showPagination?: boolean
}) {
  return (
    <Card className="w-full flex flex-col justify-between">
      <div className="flex flex-col gap-10">
        <CardHeader className="px-6 flex flex-col gap-1">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
          <CardDescription className="text-[14px] text-[#71717A]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-sm text-muted-foreground flex justify-between">
                  <th className="px-4 py-3 font-medium">F.I.SH</th>
                  <th className="px-4 py-3 font-medium">Jami xaridlar</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="text-sm flex justify-between items-center"
                  >
                    <tr className="flex flex-col gap-0 py-4 px-4">
                      <td className="whitespace-nowrap text-[14px] font-medium text-[#18181B]">
                        {transaction.buyer}
                      </td>
                      <td className="whitespace-nowrap text-[12px] text-[#71717A]">
                        {transaction.phone}
                      </td>
                    </tr>
                    <td className="px-4 py-4 whitespace-nowrap text-[14px] text-[#18181B]">
                      ${transaction.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </div>
      {showPagination && (
        <CardFooter>
          <PaginationComponent />
        </CardFooter>
      )}
    </Card>
  )
}
