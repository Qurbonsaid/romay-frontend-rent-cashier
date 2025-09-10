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
  seller: string
  amount: number
}

const dummyTransactions: Transaction[] = [
  {
    id: '1',
    seller: 'John Doe',
    amount: 1250.75,
  },
  {
    id: '2',
    seller: 'Acme Inc',
    amount: 3200.5,
  },
  {
    id: '3',
    seller: 'Sarah Johnson',
    amount: 750.25,
  },
]

export default function Recent({
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
                  <th className="px-4 py-3 font-medium">Sotuvchi F.I.SH</th>
                  <th className="px-4 py-3 font-medium">To'lov summasi</th>
                </tr>
              </thead>
              <tbody className="divide-y border-b">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="text-sm flex justify-between"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      {transaction.seller}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
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
