import { Skeleton, Spin } from "antd"
import AuthenticatedFooter from "./AuthenticatedFooter"
import AuthenticatedNavbar from "./AuthenticatedNavbar"

const Loading = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <AuthenticatedNavbar/>
            <main className='min-h-[100vh] p-[100px] flex flex-col items-center'>
                <Spin size="large" />
            </main>
            <AuthenticatedFooter  />
        </div>

        
    )
}

export default Loading


