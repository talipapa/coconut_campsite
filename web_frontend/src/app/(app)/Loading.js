import { Skeleton } from "antd"
import AuthenticatedFooter from "./AuthenticatedFooter"
import AuthenticatedNavbar from "./AuthenticatedNavbar"

const Loading = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <AuthenticatedNavbar/>
            <main className='min-h-[100vh] p-[30px]'>
                <Skeleton paragraph={{ rows: 10 }} active/>
            </main>
            <AuthenticatedFooter  />
        </div>

        
    )
}

export default Loading
