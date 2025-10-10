import { Navbar } from "@/components/navbar"
import { SettingsForm } from "@/components/settings-form"
import { SettingsSkeleton } from "@/components/skeletons/settings-skeleton"
import { Suspense } from "react"

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>
          <Suspense fallback={<SettingsSkeleton />}>
            <SettingsForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
