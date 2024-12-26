import { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Pencil, Check, X, CircleCheck, CircleAlert } from 'lucide-react'
import type { User } from '@/lib/db/actions'
import { userUpdateSchema, type UserUpdateValues } from '@/lib/validators/user'
import { getUser, updateUser } from '@/lib/store/userStore'
import { updateUser as updateUserDb } from '@/lib/db/actions'

export default function AccountSettings() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAlert, setShowAlert] = useState<{ show: boolean; field?: string; error?: boolean; message?: string; }>({ show: false })
  const [editingField, setEditingField] = useState<keyof UserUpdateValues | null>(null)

  const form = useForm<UserUpdateValues>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    },
  })

  useEffect(() => {
    const loadUser = async () => {
      const userData = await getUser()
      if (userData) {
        setUser(userData)
        form.reset({
          name: userData.name,
          email: userData.email,
          username: userData.username,
          first_name: userData.first_name || '',
          last_name: userData.last_name || '',
        })
      }
      setLoading(false)
    }
    loadUser()
  }, [form])

  const onSubmit = async (field: keyof UserUpdateValues) => {
    if (!user) return

    try {
      const value = form.getValues(field)
      const updatedUser = { ...user, [field]: value }
      await updateUser(updatedUser)
      await updateUserDb(updatedUser)
      setUser(updatedUser)
      setShowAlert({ show: true, field: field, message: 'Updated successfully' })
      setEditingField(null)
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      console.error(error)
      setShowAlert({ show: true, field: field, error: true, message: error.message })
    }
    setTimeout(() => {
      setShowAlert({ show: false })
    }, 3000)
  }

  if (loading) return <div>Loading...</div>

  const renderField = (field: keyof UserUpdateValues, label: string) => {
    const isEditing = editingField === field
    const value = form.getValues(field)

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor={field}>{label}</Label>
          {!isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingField(field)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          ) : (
            <div className="space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSubmit(field)}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingField(null)
                  form.reset({ [field]: user?.[field] })
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <Input
            id={field}
            {...form.register(field)}
            className={form.formState.errors[field] ? 'border-red-500' : ''}
          />
        ) : (
          <div className="p-2 bg-muted rounded-md">{value}</div>
        )}
        {form.formState.errors[field] && (
          <p className="text-sm text-red-500">
            {form.formState.errors[field]?.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderField('name', 'Name')}
        {renderField('email', 'Email')}
        {renderField('username', 'Username')}
        {renderField('first_name', 'First Name')}
        {renderField('last_name', 'Last Name')}

        {showAlert.show && (
          showAlert.error ? (
            <div className="rounded-lg border border-red-500/50 px-4 py-3 text-red-600">
              <div className="flex gap-3">
                <CircleAlert
                  className="mt-0.5 shrink-0 opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <div className="grow space-y-1">
                  <p className="text-sm font-medium">Error in {showAlert.field}</p>
                  <ul className="list-inside list-disc text-sm opacity-80">
                    <li>{showAlert.message}</li>
                    <li>{showAlert.error}</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-emerald-500/50 px-4 py-3 text-emerald-600">
              <p className="text-sm">
                <CircleCheck
                  className="-mt-0.5 me-3 inline-flex opacity-60"
                  size={16}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Completed successfully! : {showAlert.message}
              </p>
            </div>
          )
        )} 
      </CardContent>
    </Card>
  )
}

