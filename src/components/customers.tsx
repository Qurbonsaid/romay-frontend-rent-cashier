import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

type Customer = {
  id: string
  name: string
  phone: string
  segment: string
  orders: number
  job: string
  branch: string
}

const dummyCustomers: Customer[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '+998 99 123 45 67',
    segment: "O'rta",
    orders: 15,
    job: 'Usta',
    branch: 'Termiz',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    phone: '+998 99 765 43 21',
    segment: "O'rta",
    orders: 8,
    job: 'Usta',
    branch: 'Termiz',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phone: '+998 97 123 45 67',
    segment: "O'rta",
    orders: 2,
    job: 'Usta',
    branch: 'Termiz',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    phone: '+998 93 987 65 43',
    segment: "O'rta",
    orders: 25,
    job: 'Usta',
    branch: 'Termiz',
  },
]

export default function Customers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">Mijozlar</h1>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Segment bo'yicha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barchasi</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="regular">Oddiy</SelectItem>
              <SelectItem value="new">Yangi</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Saralash" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Oxirgi tashrif</SelectItem>
              <SelectItem value="orders">Buyurtmalar soni</SelectItem>
              <SelectItem value="spent">Sarflangan summa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
            <tr>
              <th className="px-6 py-3 text-left font-medium">Ismi</th>
              <th className="px-6 py-3 text-left font-medium">
                Telefon raqami
              </th>
              <th className="px-6 py-3 text-left font-medium">Segment</th>
              <th className="px-6 py-3 text-center font-medium">Kasbi</th>
              <th className="px-6 py-3 text-center font-medium">Buyurtmalar</th>
              <th className="px-6 py-3 text-center font-medium">Filial</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            {dummyCustomers.map((customer) => (
              <tr
                key={customer.id}
                className="hover:bg-[#F9F9F9] cursor-pointer"
                onClick={() =>
                  (window.location.href = `/ceo/customers/customer-detail/${customer.id}`)
                }
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-[#18181B]">
                    {customer.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">{customer.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-[#18181B]">
                    {customer.segment}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">{customer.job}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {customer.orders}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-[#18181B]">
                    {customer.branch}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
