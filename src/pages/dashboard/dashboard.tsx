import React from 'react'
import { Box, CreditCard, LayoutGrid, UsersRound } from 'lucide-react'
import Recent from '@/components/recent'
import Workers from '@/components/workers'
import Rating from '@/components/rating'
import { RevenueChart } from '@/components/revenue-chart'
import { CardComponent } from '@/components/card'

export const DashboardPage: React.FC = () => {
  return (
    <div className="w-full">
      <div className="px-4 sm:px-6 lg:px-0 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <CardComponent
            title={'Umumiy tushum'}
            description={'+20% bu oyda oshgan'}
            amount={"169,867,736 so'm"}
            icon={<LayoutGrid size={16} />}
          />
          <CardComponent
            title={'Sotuvlar'}
            description={'+22% bu oyda oshgan'}
            amount={"169,867,736 so'm"}
            icon={<CreditCard size={16} />}
          />
          <CardComponent
            title={'Mijozlar'}
            description={'+99 ta bu oyda yangi mijoz'}
            amount={'527'}
            icon={<UsersRound size={16} />}
          />
          <CardComponent
            title={'Qarzlar'}
            description={"+45% bu oyda yig'ib olingan"}
            amount={'54,896,709 so’m'}
            style="negative"
            icon={<CreditCard size={16} />}
          />
          <CardComponent
            title={'Balans'}
            description={'+45% bu oyda oshgan'}
            amount={'54,896,709 so’m'}
            icon={<CreditCard size={16} />}
          />
          <CardComponent
            title={'Sof foyda'}
            description={'+45% bu oyda oshgan'}
            amount={'169,867,736 so’m'}
            icon={<CreditCard size={16} />}
          />
          <CardComponent
            title={'Xodimlar'}
            description={'+99 ta bu oyda yangi xodim'}
            amount={'25 ta'}
            icon={<UsersRound size={16} />}
          />
          <CardComponent
            title={'Qolgan tovarlar narxi'}
            description={'+20% o’tgan oyga nisbatan'}
            amount={"169,867,736 so'm"}
            icon={<Box size={16} />}
          />
        </div>
        <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevenueChart />
          <Recent
            title="So'nggi sotuvlar"
            description="Do'konlardagi oxirgi pul o'tkazmalari"
          />
        </div>
        <div className="my-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Workers title="KPI yuqori xodimlar" />
          <Rating
            title="Mijozlar reytingi"
            description="Barcha filiallar bo’yicha eng yaxshi mijozlar."
          />
        </div>
      </div>
    </div>
  )
}
