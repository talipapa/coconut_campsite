"use client"

import { Breadcrumb } from "antd"
import AccountDetails from "./AccountDetails"
import ChangePassword from "./ChangePassword"



export default function Page() {

    

    return (
        <>
            <header className="bg-[#363636] shadow">
                <div className="max-w-7xl py-6 px-4 sm:px-6 lg:px-8">

                    <h2 className="font-semibold text-xl text-[#ffffff] leading-tight">
                    <Breadcrumb
                        items={[
                        {
                            title: <a href="/" className="!text-[#acabab]">Home</a>,
                        },
                        {
                            title: <span className="text-white cursor-pointer">Account setting</span>,
                        }]}
                    />
                    </h2>
                </div>
            </header>
            <div className="space-y-10 mb-12 md:w-[60vw] divide-y-2">
                <AccountDetails/>
                <ChangePassword/>
            </div>
        </>
    )
}