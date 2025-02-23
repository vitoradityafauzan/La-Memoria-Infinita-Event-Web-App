import Link from "next/link"

const LogOut = () => {
    return (
        <div className="flex h-full items-center gap-[20px] font-semibold text-black">
         
            <button className="w-[80px] h-[30px] bg-white text-[15px] rounded-full">
                Log Out
            </button>
        </div>
    )
}

export default LogOut