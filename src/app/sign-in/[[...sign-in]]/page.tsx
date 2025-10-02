import { SignIn } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
            <SignIn />
        </div>
    )
}