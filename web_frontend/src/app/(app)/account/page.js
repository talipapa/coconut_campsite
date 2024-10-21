"use client"

import AccountDetails from "./AccountDetails"
import ChangePassword from "./ChangePassword"



export default function Page() {

    

    return (
        <div className="space-y-10 mb-12 md:w-[60vw] divide-y-2">
            <AccountDetails/>
            <ChangePassword/>
        </div>
    )
}