// src/layouts/Layout.tsx
import { useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/appSidebar'
import {
  LayoutGrid,
  Flame,
  type LucideIcon,
  Gift,
  Network,
  Locate,
  History,
  UserRound,
  Wrench,
  CircleArrowOutUpRight,
  Package,
  SquareCheckBig,
  Contact,
  Import,
  Upload,
  Store,
} from 'lucide-react'
import { Separator } from './ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Calendar22 } from './calendar'
import { ServiceBalance } from './ServiceBalance'
import { useGetAllBranchesQuery } from '@/store/branch/branch.api'

interface LayoutProps {
  children: ReactNode
  role: string
  name: string
  header: string
  options?: boolean
}

interface SidebarItem {
  title: string
  icon: LucideIcon
  url: string
}

interface SidebarGroup {
  label: string
  items: SidebarItem[]
}

export const Layout = ({ children, role, name, header }: LayoutProps) => {
  const location = useLocation()
  // Example: Sidebar groups differ by role
  const groups: SidebarGroup[] =
    role === 'CEO'
      ? [
          {
            label: 'Asosiy',
            items: [
              { title: 'Dashboard', icon: LayoutGrid, url: '/ceo/dashboard' },
              { title: 'KPI tizimi', icon: Flame, url: '/ceo/kpi' },
              { title: "Tug'ilgan kun", icon: Gift, url: '/ceo/birthday' },
            ],
          },
          {
            label: 'Xodimlar bloki',
            items: [
              { title: 'Boshqaruv', icon: Network, url: '/ceo/management' },
              { title: 'Filiallar', icon: Locate, url: '/ceo/branches' },
              {
                title: "O'zgaruvchilar tarixi",
                icon: History,
                url: '/ceo/history',
              },
            ],
          },
          {
            label: 'Mijozlar bloki',
            items: [
              { title: 'Mijozlar', icon: UserRound, url: '/clients' },
              { title: "Ta'minotchilar", icon: Contact, url: '/ceo/suppliers' },
              {
                title: 'Buyurtmalar',
                icon: SquareCheckBig,
                url: '/ceo/orders',
              },
              { title: 'Mahsulotlar', icon: Package, url: '/ceo/products' },
              {
                title: 'Ijaralar',
                icon: CircleArrowOutUpRight,
                url: '/ceo/rents',
              },
              { title: "Ta'mirlash", icon: Wrench, url: '/ceo/repairs' },
            ],
          },
        ]
      : role === 'Manager'
        ? [
            {
              label: 'Asosiy',
              items: [
                {
                  title: 'Dashboard',
                  icon: LayoutGrid,
                  url: '/manager/dashboard',
                },
              ],
            },
            {
              label: 'Mijozlar bloki',
              items: [
                { title: 'Mijozlar', icon: UserRound, url: '/clients' },
                {
                  title: "Ta'minotchilar",
                  icon: Contact,
                  url: '/manager/suppliers',
                },
                {
                  title: 'Buyurtmalar',
                  icon: SquareCheckBig,
                  url: '/manager/orders',
                },
                {
                  title: 'Mahsulotlar',
                  icon: Package,
                  url: '/manager/products',
                },
                {
                  title: 'Ijaralar',
                  icon: CircleArrowOutUpRight,
                  url: '/manager/rents',
                },
                { title: "Ta'mirlash", icon: Wrench, url: '/manager/repairs' },
              ],
            },
          ]
        : role === 'Service'
          ? [
              {
                label: 'Asosiy',
                items: [
                  { title: 'Sotuv', icon: Store, url: '/service/selling' },
                  { title: 'Qabul qilish', icon: Import, url: '/' },
                ],
              },
              {
                label: "Ma'lumotlar",
                items: [
                  {
                    title: 'Mijozlar',
                    icon: UserRound,
                    url: '/clients',
                  },
                  {
                    title: 'Buyurtmalar',
                    icon: SquareCheckBig,
                    url: '/service/orders',
                  },
                  {
                    title: 'Mahsulotlar',
                    icon: Package,
                    url: '/service/products',
                  },
                  {
                    title: 'Ijaralar',
                    icon: CircleArrowOutUpRight,
                    url: '/service/rents',
                  },
                  {
                    title: "Ta'mirlash",
                    icon: Wrench,
                    url: '/service/repairs',
                  },
                ],
              },
            ]
          : role === 'Store'
            ? [
                {
                  label: 'Asosiy',
                  items: [
                    { title: 'Sotuv', icon: Store, url: '/store/selling' },
                    { title: 'Qabul qilish', icon: Import, url: '/' },
                  ],
                },
                {
                  label: "Ma'lumotlar",
                  items: [
                    {
                      title: 'Mijozlar',
                      icon: UserRound,
                      url: '/clients',
                    },

                    {
                      title: 'Buyurtmalar',
                      icon: SquareCheckBig,
                      url: '/store/orders',
                    },
                    {
                      title: 'Mahsulotlar',
                      icon: Package,
                      url: '/store/products',
                    },
                  ],
                },
              ]
            : [
                {
                  label: 'Asosiy',
                  items: [
                    {
                      title: 'Dashboard',
                      icon: LayoutGrid,
                      url: '/warehouse/',
                    },
                    {
                      title: 'Qabul qilish',
                      icon: Import,
                      url: '/warehouse/accept',
                    },
                    {
                      title: 'Filialga berish',
                      icon: Upload,
                      url: '/warehouse/branch-give',
                    },
                  ],
                },
                {
                  label: "Ma'lumotlar",
                  items: [
                    {
                      title: "Ta'minotchilar",
                      icon: Contact,
                      url: '/warehouse/suppliers',
                    },
                    {
                      title: 'Mahsulotlar',
                      icon: Package,
                      url: '/warehouse/products',
                    },
                  ],
                },
              ]
  const { data: { data: branches } = {} } = useGetAllBranchesQuery({})
  const [selectedBranch, setSelectedBranch] = useState<string>('')

  const isActive = (url: string) => {
    // Add role to the URL if it's not already included
    const roleBasedUrl = url.startsWith(`/${role.toLowerCase()}`)
      ? url
      : `/${role.toLowerCase()}${url}`

    return (
      location.pathname === roleBasedUrl ||
      (url !== '/' && location.pathname.startsWith(roleBasedUrl))
    )
  }

  useEffect(() => {
    if (branches) {
      setSelectedBranch(branches[0]._id)
    }
  }, [branches])

  return (
    <SidebarProvider>
      <AppSidebar
        groups={groups.map((group) => ({
          ...group,
          items: group.items.map((item) => ({
            ...item,
            isActive: isActive(item.url),
          })),
        }))}
        header={
          <div className="p-2 flex items-center gap-2">
            <img src="/logo.svg" alt="" className="h-6 w-6" />
            {/* 👇 only show text when sidebar is expanded */}
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-semibold text-[14px] leading-[100%]">
                Romay ERP
              </span>
              <span className="text-[12px] leading-[100%]">v1.0</span>
            </div>
          </div>
        }
        footer={
          // 👇 footer disappears in collapsed state
          <div className="px-2 text-sm group-data-[collapsible=icon]:hidden">
            {name}
          </div>
        }
      />
      <SidebarInset>
        <header className="border-b">
          <div className="flex items-center pr-6 justify-between">
            <div className="container flex h-16 items-center justify-between px-4 pr-0">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                {/* <Separator className="mx-2 h-6"/> */}
                <Separator
                  orientation="vertical"
                  className="min-h-4 min-w-0.5"
                />
                <h1 className="text-md font-medium">{header}</h1>
                {/* <span className="text-sm text-muted-foreground">({role})</span> */}
              </div>
            </div>
            <div className="flex gap-4">
              <ServiceBalance />
              <Calendar22 />
              <Select
                onValueChange={(value) => {
                  setSelectedBranch(value)
                }}
                value={selectedBranch}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Barch Filiallar" />
                </SelectTrigger>
                <SelectContent>
                  {branches?.map((branch) => (
                    <SelectItem key={branch._id} value={branch._id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>
        <main className="px-6 py-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
