'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import {
  LayoutGrid,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutGrid
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: Calendar
  },
  {
    title: 'Members',
    href: '/admin/members',
    icon: Users
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings
  }
]

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const [userData, setUserData] = useState(null)
  const pathname = usePathname()
  const router = useRouter()

  const checkUser = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        console.log("No session found, redirecting to login")
        router.push('/login')
        return
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.log("No user found, redirecting to login")
        router.push('/login')
        return
      }

      // Here you can add additional checks for admin role if needed
      setUserData(user)
      
    } catch (error) {
      console.error("Error checking auth:", error)
      router.push('/login')
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full bg-gray-900 text-white transition-all duration-300',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Toggle button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-9 flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-gray-800">
          <span className={cn('font-bold', collapsed ? 'text-sm' : 'text-xl')}>
            {collapsed ? 'SC' : 'SCUG Admin'}
          </span>
        </div>

        {/* User info */}
        <div className={cn(
          'mt-6 px-3 py-2',
          collapsed ? 'text-center' : 'border-b border-gray-800 pb-6'
        )}>
          <div className="flex items-center">
            <Avatar className={cn('h-8 w-8', collapsed ? 'mx-auto' : 'mr-3')}>
              <AvatarImage src={userData?.user_metadata?.avatar_url} />
              <AvatarFallback>{userData?.email ? getInitials(userData.email) : 'U'}</AvatarFallback>
            </Avatar>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {userData?.user_metadata?.full_name || userData?.email || 'Admin'}
                </span>
                <span className="text-xs text-gray-400">
                  {userData?.email || ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Menu items */}
        <nav className="mt-6 px-3">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'mb-2 flex items-center rounded-lg px-3 py-2 transition-colors',
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-gray-400 hover:bg-gray-800 hover:text-white',
              collapsed ? 'px-3' : ''
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          collapsed ? 'ml-16' : 'ml-64'
        )}
      >
        {children}
      </div>
    </div>
  )
}
