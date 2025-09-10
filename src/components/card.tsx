import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const CardComponent = ({
  title,
  description,
  amount,
  icon,
  style = 'positive',
}: {
  title: string
  amount: string
  description: string
  footer?: React.ReactNode
  icon?: React.ReactNode
  style?: 'positive' | 'negative'
}) => {
  return (
    <Card className="gap-2">
      <CardHeader className="flex items-center justify-between">
        <CardDescription className="font-medium text-[#09090B] text-[14px]">
          {title}
        </CardDescription>
        <div className="flex items-center gap-2">{icon}</div>
      </CardHeader>
      <div>
        <CardContent>
          <CardTitle
            className={`text-[24px] font-bold mb-0 ${style === 'negative' ? 'text-red-600' : 'text-[#09090B]'}`}
          >
            {amount}
          </CardTitle>
        </CardContent>
        <CardFooter>
          <CardDescription className="text-3 text-[#15803D]">
            {description}
          </CardDescription>
        </CardFooter>
      </div>
    </Card>
  )
}
