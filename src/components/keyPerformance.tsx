import { Calendar22 } from './calendar'
import { CreditCard, DollarSign, UsersRound } from 'lucide-react'
import { CardComponent } from './card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

export default function KeyPerformance() {
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-[30px] font-semibold text-[#09090B]">KPI Tizimi</h1>
        <div className="flex gap-2">
          <Calendar22 />
          {/* <Modal
            button={
              <Button>
                KPI tizimini qo'shish <Plus />
              </Button>
            }
            title="KPI tizimini qo'shish"
            description="Bu yerda KPI qo’sha olasiz"
            children={
              <>
                <div className="flex flex-col gap-5 mt-5">
                  <div className="flex flex-col gap-3">
                    <Label>KPI nomi</Label>
                    <Input placeholder="misol: mahsulot sotuvi" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>KPI Yo'nalishi</Label>
                    <Select defaultValue="tamirlash">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Yo'nalishni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tamirlash">Tamirlash</SelectItem>
                        <SelectItem value="sotuv">Sotuv</SelectItem>
                        <SelectItem value="ijara">Ijara</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Label>KPI Tarif</Label>
                    <RadioGroup
                      defaultValue="option-one"
                      className="flex gap-10"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-one" id="option-one" />
                        <Label htmlFor="option-one">Summa bo’yicha</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="option-two" id="option-two" />
                        <Label htmlFor="option-two">Son bo’yicha</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>Tamomlash soni</Label>
                    <Select defaultValue="10">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tamomlash soni" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="40">40</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Label>KPI Tavsifi</Label>
                    <Textarea placeholder="tasnif" />
                  </div>
                </div>
              </>
            }
          /> */}
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <CardComponent
          title="Jami xodimlar"
          amount="125"
          description="+20% bu oyda oshgan"
          icon={<DollarSign size={16} />}
        />
        <CardComponent
          title="O'rtacha samaradorlik"
          amount="85%"
          description="+22% bu oyda oshgan"
          icon={<CreditCard size={16} />}
        />
        <CardComponent
          title="Yuqori samaradorlik"
          amount="2"
          description="+99 ta bu oyda yangi mijoz"
          icon={<UsersRound size={16} />}
        />
        <CardComponent
          title="Yaxshilanish kerak"
          amount="0"
          description="+45% bu oyda yig'ib olingan"
          style="negative"
          icon={<CreditCard size={16} />}
        />
      </div>
      <div>
        <div className="flex justify-between items-center my-8">
          <h2 className="text-[20px] font-semibold text-[#09090B]">
            KPI yo’nalishlar
          </h2>
          <div className="flex gap-2">
            <Select defaultValue="filial">
              <SelectTrigger>
                <SelectValue placeholder="Filialni tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="filial">Barcha Filiallar</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="kpi">
              <SelectTrigger>
                <SelectValue placeholder="KPI yo’nalishini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jami">Jami xodimlar</SelectItem>
                <SelectItem value="kpi">Barcha KPI</SelectItem>
                <SelectItem value="grape">Grape</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="border border-[#E4E4E7] rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F9F9F9] text-[#71717A] text-sm">
              <tr>
                <th className="px-6 py-3 text-center"></th>
                <th className="px-6 py-3 text-left font-medium">KPI</th>
                <th className="px-6 py-3 text-left font-medium">Tavsiya</th>
                <th className="px-6 py-3 text-center font-medium">Filial</th>
                <th className="px-6 py-3 text-center font-medium">Xodimlar</th>
                <th className="px-6 py-3 text-center font-medium">
                  Samaradorlik
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              <tr className="hover:bg-[#F9F9F9]">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                  1
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                  Sotuv
                </td>
                <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                  Epa 1000 ta mahsulotini sotish
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                  10
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                  150
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  85%
                </td>
              </tr>
              <tr className="hover:bg-[#F9F9F9]">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                  2
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                  Tushum
                </td>
                <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                  10 500 000 so'm oylik tushum
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                  9
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                  120
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  85%
                </td>
              </tr>
              <tr className="hover:bg-[#F9F9F9]">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                  3
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                  Ta'mir
                </td>
                <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                  kunlik 50 ta ta'mir
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                  8
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                  130
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  85%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
