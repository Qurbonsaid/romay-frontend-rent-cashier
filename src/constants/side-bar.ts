// sidebar-groups.ts
import {
  LayoutGrid,
  Flame,
  Gift,
  Network,
  Locate,
  History,
  UserRound,
  Contact,
  SquareCheckBig,
  Package,
  CircleArrowOutUpRight,
  Wrench,
  Store,
  Import,
  Upload,
  Ticket,
} from 'lucide-react'

export type Role =
  | 'ceo'
  | 'manager'
  | 'sale_cashier'
  | 'rent_cashier'
  | 'storekeeper'

export interface SidebarItem {
  title: string
  icon: any
  url: string
}

export interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export const getSidebarGroups = (role: Role): SidebarGroup[] => {
  switch (role) {
    case 'ceo':
      return [
        {
          label: 'Asosiy',
          items: [
            { title: 'Dashboard', icon: LayoutGrid, url: '/dashboard' },
            { title: 'KPI tizimi', icon: Flame, url: '/kpi' },
            { title: "Tug'ilgan kun", icon: Gift, url: '/birthday' },
          ],
        },
        {
          label: 'Xodimlar bloki',
          items: [
            { title: 'Boshqaruv', icon: Network, url: '/management' },
            { title: 'Filiallar', icon: Locate, url: '/branches' },
            {
              title: "O'zgaruvchilar tarixi",
              icon: History,
              url: '/history',
            },
          ],
        },
        {
          label: 'Mijozlar bloki',
          items: [
            { title: 'Mijozlar', icon: UserRound, url: '/clients' },
            { title: "Ta'minotchilar", icon: Contact, url: '/suppliers' },
            { title: 'Buyurtmalar', icon: SquareCheckBig, url: '/orders' },
            { title: 'Mahsulotlar', icon: Package, url: '/products' },
            {
              title: 'Ijaralar',
              icon: CircleArrowOutUpRight,
              url: '/rents',
            },
            { title: "Ta'mirlash", icon: Wrench, url: '/repairs' },
            { title: 'Bonuslar', icon: Ticket, url: '/bonuses' },
          ],
        },
      ]

    case 'manager':
      return [
        {
          label: 'Asosiy',
          items: [{ title: 'Dashboard', icon: LayoutGrid, url: '/dashboard' }],
        },
        {
          label: 'Mijozlar bloki',
          items: [
            { title: 'Mijozlar', icon: UserRound, url: '/clients' },
            {
              title: "Ta'minotchilar",
              icon: Contact,
              url: '/suppliers',
            },
            {
              title: 'Buyurtmalar',
              icon: SquareCheckBig,
              url: '/orders',
            },
            { title: 'Mahsulotlar', icon: Package, url: '/products' },
            {
              title: 'Ijaralar',
              icon: CircleArrowOutUpRight,
              url: '/rents',
            },
            { title: "Ta'mirlash", icon: Wrench, url: '/repairs' },
            { title: 'Bonuslar', icon: Ticket, url: '/bonuses' },
          ],
        },
      ]

    case 'sale_cashier':
      return [
        {
          label: 'Asosiy',
          items: [
            { title: 'Sotuv', icon: Store, url: '/selling' },
            { title: 'Qabul qilish', icon: Import, url: '/accept' },
          ],
        },
        {
          label: "Ma'lumotlar",
          items: [
            { title: 'Mijozlar', icon: UserRound, url: '/clients' },
            { title: 'Buyurtmalar', icon: SquareCheckBig, url: '/orders' },
            { title: 'Mahsulotlar', icon: Package, url: '/products' },
          ],
        },
      ]

    case 'rent_cashier':
      return [
        {
          label: 'Asosiy',
          items: [
            { title: 'Ijara', icon: CircleArrowOutUpRight, url: '/' },
            { title: "Ta'mirlash", icon: Wrench, url: '/repairs' },
            { title: 'Bonuslar', icon: Ticket, url: '/bonuses' },
          ],
        },
        {
          label: "Ma'lumotlar",
          items: [
            { title: 'Mijozlar', icon: UserRound, url: '/clients' },
            { title: 'Mahsulotlar', icon: Package, url: '/products' },
          ],
        },
      ]

    case 'storekeeper':
    default:
      return [
        {
          label: 'Asosiy',
          items: [
            {
              title: 'Dashboard',
              icon: LayoutGrid,
              url: '/dashboard',
            },
            { title: 'Qabul qilish', icon: Import, url: '/accept' },
            {
              title: 'Filialga berish',
              icon: Upload,
              url: '/branch-give',
            },
          ],
        },
        {
          label: "Ma'lumotlar",
          items: [
            {
              title: "Ta'minotchilar",
              icon: Contact,
              url: '/suppliers',
            },
            { title: 'Mahsulotlar', icon: Package, url: '/products' },
          ],
        },
      ]
  }
}
