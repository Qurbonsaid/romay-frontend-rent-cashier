import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Calendar22 } from './calendar'

export default function Birthday() {
  return (
    <div>
      <div className="flex justify-between items-center my-8">
        <h1 className="text-[30px] font-semibold text-[#09090B]">
          Tug’ilgan kun
        </h1>
        <div className="flex gap-2">
          <Calendar22 />
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
              <th className="px-6 py-3 text-left font-medium">Mijoz</th>
              <th className="px-6 py-3 text-left font-medium">
                Tug’ilgan kuni
              </th>
              <th className="px-6 py-3 text-center font-medium">
                Telefon raqami
              </th>
              <th className="px-6 py-3 text-center font-medium">Filial</th>
              <th className="px-6 py-3 text-center font-medium">
                Mijoz segmenti
              </th>
              <th className="px-6 py-3 text-center font-medium">Tushum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E4E7]">
            <tr className="hover:bg-[#F9F9F9]">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                1
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                Suxrob
              </td>
              <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                22-fevral
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                +998 99 842 79 79
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                Termiz
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                Yuqori
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                12 000 000
              </td>
            </tr>
            <tr className="hover:bg-[#F9F9F9]">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                1
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                Suxrob
              </td>
              <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                22-fevral
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                +998 99 842 79 79
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                Termiz
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                Yuqori
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                12 000 000
              </td>
            </tr>
            <tr className="hover:bg-[#F9F9F9]">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                1
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                Suxrob
              </td>
              <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                22-fevral
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                +998 99 842 79 79
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                Termiz
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                Yuqori
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                12 000 000
              </td>
            </tr>
            <tr className="hover:bg-[#F9F9F9]">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                1
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                Suxrob
              </td>
              <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                22-fevral
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                +998 99 842 79 79
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                Termiz
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                Yuqori
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                12 000 000
              </td>
            </tr>
            <tr className="hover:bg-[#F9F9F9]">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                1
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                Suxrob
              </td>
              <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                22-fevral
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                +998 99 842 79 79
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                Termiz
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                Yuqori
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                12 000 000
              </td>
            </tr>
            <tr className="hover:bg-[#F9F9F9]">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-left">
                1
              </td>
              <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-[#18181B] text-left">
                Suxrob
              </td>
              <td className="px-6 py-4 text-sm text-[#18181B] text-left">
                22-fevral
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                +998 99 842 79 79
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#18181B] text-center">
                Termiz
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                Yuqori
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                12 000 000
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
