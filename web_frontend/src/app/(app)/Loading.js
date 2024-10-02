import { Skeleton } from "antd"
import Header from "./Header"
import { FaFacebookSquare } from "react-icons/fa"
import AuthenticatedFooter from "./AuthenticatedFooter"
import AuthenticatedNavbar from "./AuthenticatedNavbar"

const Loading = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <AuthenticatedNavbar/>
            <main className='min-h-[100vh] p-[30px]'>
                <Skeleton paragraph={{ rows: 10 }}/>
            </main>
            <AuthenticatedFooter />
        </div>

        
    )
}

export default Loading
